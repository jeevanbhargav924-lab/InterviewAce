import { NextResponse } from "next/server";
import vm from "vm";

interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, testCases, functionName } = body as { 
      code: string; 
      testCases: TestCase[]; 
      functionName: string;
    };

    if (!code || !testCases || !functionName) {
      return NextResponse.json({ message: "Missing required compilation arguments." }, { status: 400 });
    }

    const results = testCases.map((tc, idx) => {
      // Set up isolated sandbox
      const sandbox = {
        result: null as any,
        consoleLogs: [] as string[],
      };
      
      const context = vm.createContext({
        console: {
          log: (...args: any[]) => {
            sandbox.consoleLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a.toString()).join(" "));
          }
        }
      });

      // Construct script to run
      // It appends an invocation line like: result = functionName(inputArgs)
      const executionCode = `
        ${code}
        try {
          result = ${functionName}(${tc.input});
        } catch (e) {
          throw e;
        }
      `;

      let passed = false;
      let output = "";
      let error = "";

      try {
        const script = new vm.Script(executionCode);
        // Execute inside sandbox with strict timeout
        script.runInContext(context, { timeout: 1000 });
        
        const runtimeResult = (context as any).result;
        
        // Clean and compare results
        const expected = eval(`(${tc.expectedOutput})`);
        const serializedResult = JSON.stringify(runtimeResult);
        const serializedExpected = JSON.stringify(expected);
        
        passed = serializedResult === serializedExpected;
        output = serializedResult;
      } catch (err: any) {
        passed = false;
        error = err.message || "Execution Error";
      }

      return {
        id: idx + 1,
        input: tc.input,
        expected: tc.expectedOutput,
        actual: output || "undefined",
        passed,
        error,
        logs: (context as any).consoleLogs,
        isHidden: tc.isHidden
      };
    });

    const passedCount = results.filter(r => r.passed).length;
    const allPassed = passedCount === results.length;

    return NextResponse.json({
      success: true,
      allPassed,
      passedCount,
      totalCount: results.length,
      results
    });

  } catch (error: any) {
    console.error("Code Sandbox execution error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Failed to execute solution." 
    }, { status: 500 });
  }
}
