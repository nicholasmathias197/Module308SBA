// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500
    }
  ]
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47
    }
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150
    }
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400
    }
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39
    }
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140
    }
  }
];

// Main function to process learner data
function getLearnerData(course, ag, submissions) {
  // Validate course assignment group match
  if (ag.course_id !== course.id) {
    throw new Error("Invalid input: AssignmentGroup does not belong to the course");
  }

  const results = [];
  const currentDate = new Date();

  // Get unique learner IDs
  const learnerIds = [...new Set(submissions.map(sub => sub.learner_id))];

  // Process each learner
  learnerIds.forEach(learnerId => {
    const learnerResult = {
      id: learnerId,
      avg: 0
    };

    let totalWeightedScore = 0;
    let totalWeight = 0;

    // Process each assignment in the group
    ag.assignments.forEach(assignment => {
      // Skip assignments that aren't due yet
      const dueDate = new Date(assignment.due_at);
      if (dueDate > currentDate) {
        return;
      }

      // Skip assignments with 0 or negative points possible
      if (assignment.points_possible <= 0) {
        return;
      }

      // Find the learner's submission for this assignment
      const submission = submissions.find(
        sub => sub.learner_id === learnerId && sub.assignment_id === assignment.id
      );

      let score = 0;
      
      if (submission) {
        // Check if submission is late
        const submittedDate = new Date(submission.submission.submitted_at);
        const isLate = submittedDate > dueDate;
        
        // Apply late penalty if needed
        if (isLate) {
          score = Math.max(0, submission.submission.score - (assignment.points_possible * 0.1));
        } else {
          score = submission.submission.score;
        }
        
        // Cap score at points_possible
        score = Math.min(score, assignment.points_possible);
      }
      // If no submission, score remains 0

      // Calculate percentage for this assignment
      const percentage = score / assignment.points_possible;
      
      // Add to result object
      learnerResult[assignment.id] = Number(percentage.toFixed(3));
      
      // Add to weighted totals for average
      totalWeightedScore += percentage * assignment.points_possible;
      totalWeight += assignment.points_possible;
    });

    // Calculate weighted average
    if (totalWeight > 0) {
      learnerResult.avg = Number((totalWeightedScore / totalWeight).toFixed(3));
    }

    results.push(learnerResult);
  });

  // Format and display results
  console.log("\nResults:");
  results.forEach(result => {
    const output = { ...result };
    // Convert all number values to proper format
    Object.keys(output).forEach(key => {
      if (typeof output[key] === 'number') {
        output[key] = Number(output[key].toFixed(3));
      }
    });
    console.log(output);
  });

  return results;
}

// Run the function
try {
  const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  console.log("\nReturn value:", result);
} catch (error) {
  console.error("Error:", error.message);
}
// Test 1: Basic functionality test
console.log("=== TEST 1: Basic Functionality ===");
const testResult = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log("✓ Test 1 completed - function ran without errors");

// Test 2: Course validation test
console.log("\n=== TEST 2: Course Validation ===");
try {
  const invalidAssignmentGroup = {
    ...AssignmentGroup,
    course_id: 999 // Different course ID
  };
  getLearnerData(CourseInfo, invalidAssignmentGroup, LearnerSubmissions);
  console.log(" Test 2 failed - should have thrown an error");
} catch (error) {
  console.log("Test 2 passed - correctly threw error:", error.message);
}


  
