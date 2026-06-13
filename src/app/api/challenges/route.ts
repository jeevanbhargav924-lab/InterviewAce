import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Challenge from "@/models/Challenge";

const SEED_CHALLENGES = [
  {
    title: "Two Sum",
    slug: "two-sum",
    category: "DSA",
    difficulty: "easy",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\n### Example 1\n**Input:** nums = [2,7,11,15], target = 9\n**Output:** [0,1]\n**Explanation:** Because nums[0] + nums[1] == 9, we return [0, 1].\n\n### Constraints\n- `2 <= nums.length <= 10^4`\n- `-10^9 <= nums[i] <= 10^9`\n- `-10^9 <= target <= 10^9`",
    starterCode: `function twoSum(nums, target) {
  // Write your code here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    functionName: "twoSum",
    testCases: [
      { input: "[2,7,11,15], 9", expectedOutput: "[0,1]", isHidden: false },
      { input: "[3,2,4], 6", expectedOutput: "[1,2]", isHidden: false },
      { input: "[3,3], 6", expectedOutput: "[0,1]", isHidden: true }
    ],
    companyTags: ["Google", "Amazon", "Microsoft"]
  },
  {
    title: "Reverse a Linked List",
    slug: "reverse-linked-list",
    category: "DSA",
    difficulty: "medium",
    description: "Given the `head` of a singly linked list, reverse the list, and return the reversed list.\n\n### Example 1\n**Input:** head = [1,2,3,4,5]\n**Output:** [5,4,3,2,1]\n\n### Constraints\n- The number of nodes in the list is in the range `[0, 5000]`.\n- `-5000 <= Node.val <= 5000`",
    starterCode: `// Represents a singly-linked list node:
// class ListNode {
//   constructor(val, next = null) {
//     this.val = val;
//     this.next = next;
//   }
// }

function reverseList(head) {
  // Write your code here
  let prev = null;
  let curr = head;
  while (curr !== null) {
    let nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`,
    functionName: "reverseList",
    testCases: [
      { input: "null", expectedOutput: "null", isHidden: false }
    ],
    companyTags: ["Facebook", "Stripe", "Netflix"]
  },
  {
    title: "Implement Debounce Function",
    slug: "js-debounce",
    category: "JavaScript",
    difficulty: "medium",
    description: "Given a function `fn` and a time in milliseconds `t`, return a **debounced** version of that function.\n\nA **debounced** function is a function whose execution is delayed by `t` milliseconds and whose execution is cancelled if it is called again within that window.\n\nThe debounced function should also receive the passed parameters.",
    starterCode: `function debounce(fn, t) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, t);
  }
}`,
    functionName: "debounce",
    testCases: [
      { input: "((a) => a), 50", expectedOutput: "undefined", isHidden: false }
    ],
    companyTags: ["Uber", "Lyft", "Airbnb"]
  },
  {
    title: "Build a React Counter Hook",
    slug: "react-counter",
    category: "React",
    difficulty: "easy",
    description: "Develop a custom hook `useCounter` that supports increments, decrements, and optional reset bounds.",
    starterCode: `function useCounter(initialValue = 0) {
  // Write your React hook style logic here
  // For sandbox compiler demo, return numeric calculations
  return initialValue;
}`,
    functionName: "useCounter",
    testCases: [
      { input: "5", expectedOutput: "5", isHidden: false }
    ],
    companyTags: ["Stripe", "Meta", "Coinbase"]
  }
];

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // Can match slug or ObjectId

    // Check count and seed default challenges if empty
    const count = await Challenge.countDocuments();
    if (count === 0) {
      await Challenge.insertMany(SEED_CHALLENGES);
    }

    if (id) {
      let challenge = null;
      // Try finding by slug first, then fallback to ObjectId
      challenge = await Challenge.findOne({ slug: id }).lean();
      if (!challenge && id.match(/^[0-9a-fA-F]{24}$/)) {
        challenge = await Challenge.findById(id).lean();
      }
      
      if (!challenge) {
        return NextResponse.json({ message: "Challenge not found" }, { status: 404 });
      }
      return NextResponse.json(challenge);
    }

    const challenges = await Challenge.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(challenges);
  } catch (error: any) {
    console.error("Challenges GET API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const formatChallenge = (data: any) => {
      const { title, description, difficulty, category, starterCode, functionName, testCases, companyTags } = data;

      if (!title || !description || !category || !starterCode || !functionName || !testCases) {
        throw new Error(`Missing required fields (title, description, category, starterCode, functionName, or testCases) for: "${title || 'Unknown'}"`);
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      return {
        title,
        slug,
        description,
        difficulty: difficulty || "medium",
        category,
        starterCode,
        functionName,
        testCases: Array.isArray(testCases) ? testCases : [],
        companyTags: Array.isArray(companyTags) ? companyTags : []
      };
    };

    if (Array.isArray(body)) {
      if (body.length === 0) {
        return NextResponse.json({ message: "Empty challenges array provided" }, { status: 400 });
      }
      const preparedChallenges = body.map((item: any) => formatChallenge(item));
      const newChallenges = await Challenge.insertMany(preparedChallenges);
      return NextResponse.json({
        message: `Successfully inserted ${newChallenges.length} coding challenges`,
        insertedCount: newChallenges.length,
        data: newChallenges
      }, { status: 201 });
    } else {
      const prepared = formatChallenge(body);
      const newChallenge = await Challenge.create(prepared);
      return NextResponse.json(newChallenge, { status: 201 });
    }
  } catch (error: any) {
    console.error("Challenges POST API error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
