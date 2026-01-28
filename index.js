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
  console.log("=".repeat(60));
  console.log("STARTING LEARNER DATA PROCESSING");
  console.log("=".repeat(60));
  console.log(`Course: ${course.name} (ID: ${course.id})`);
  console.log(`Assignment Group: ${ag.name} (ID: ${ag.id})`);
  console.log(`Total Submissions to Process: ${submissions.length}`);
  console.log("-".repeat(60));
  
  try {
    // Validate course assignment group match
    console.log("\n1. VALIDATING COURSE AND ASSIGNMENT GROUP...");
    if (ag.course_id !== course.id) {
      throw new Error(`Assignment group course_id (${ag.course_id}) does not match course id (${course.id})`);
    }
    console.log("✓ Validation passed - course and assignment group match");
    
    const currentDate = new Date();
    console.log(`Current date for comparison: ${currentDate.toISOString().split('T')[0]}`);
    console.log("-".repeat(60));
    
    let results = [];
    
    // Helper functions
    const isAssignmentDue = (assignment) => {
      const dueDate = new Date(assignment.due_at);
      return dueDate <= currentDate;
    };
    
    const isSubmissionLate = (submission, assignment) => {
      const submittedDate = new Date(submission.submission.submitted_at);
      const dueDate = new Date(assignment.due_at);
      return submittedDate > dueDate;
    };
    
    const calculateFinalScore = (submission, assignment) => {
      let finalScore = submission.submission.score;
      
      if (isSubmissionLate(submission, assignment)) {
        console.log(`   LATE SUBMISSION DETECTED - Applying 10% penalty`);
        const penalty = assignment.points_possible * 0.10;
        console.log(`      Original score: ${finalScore}, Penalty: ${penalty}`);
        finalScore = Math.max(0, finalScore - penalty);
        console.log(`      Final score after penalty: ${finalScore}`);
      }
      
      return Math.min(finalScore, assignment.points_possible);
    };
    
    // Get unique learner IDs
    const getUniqueLearnerIds = (submissionsArray) => {
      const learnerIds = [];
      submissionsArray.forEach(submission => {
        if (!learnerIds.includes(submission.learner_id)) {
          learnerIds.push(submission.learner_id);
        }
      });
      return learnerIds;
    };
    
    // Find assignment
    const findAssignment = (assignmentId) => {
      return ag.assignments.find(a => a.id === assignmentId);
    };
    
    const learnerIds = getUniqueLearnerIds(submissions);
    console.log(`\n2. UNIQUE LEARNERS IDENTIFIED: ${learnerIds.join(', ')}`);
    console.log("-".repeat(60));
    
    // Process each learner
    for (const learnerId of learnerIds) {
      console.log(`\nPROCESSING LEARNER ${learnerId}:`);
      console.log("-".repeat(40));
      
      const result = {
        id: learnerId,
        avg: 0
      };
      
      let totalScore = 0;
      let totalPossible = 0;
      let validAssignmentCount = 0;
      
      // Get all submissions for this learner
      const learnerSubmissions = submissions.filter(s => s.learner_id === learnerId);
      console.log(`Found ${learnerSubmissions.length} submission(s) for this learner`);
      
      for (const submission of learnerSubmissions) {
        console.log(`\n  Processing submission for assignment ${submission.assignment_id}:`);
        
        const assignment = findAssignment(submission.assignment_id);
        
        if (!assignment) {
          console.log(`  Assignment ${submission.assignment_id} not found in assignment group - SKIPPING`);
          continue;
        }
        
        console.log(`    Assignment: ${assignment.name}`);
        console.log(`    Due date: ${assignment.due_at}`);
        console.log(`    Points possible: ${assignment.points_possible}`);
        console.log(`    Submitted at: ${submission.submission.submitted_at}`);
        console.log(`    Raw score: ${submission.submission.score}`);
        
        // Check if assignment is due
        if (!isAssignmentDue(assignment)) {
          console.log(`  Assignment due date is in the future (${assignment.due_at}) - SKIPPING`);
          continue;
        }
        
        // Check for valid points_possible
        if (!assignment.points_possible || assignment.points_possible <= 0) {
          console.log(` Assignment has invalid points_possible (${assignment.points_possible}) - SKIPPING`);
          continue;
        }
        
        // Check if submission is late
        const late = isSubmissionLate(submission, assignment);
        console.log(`    Submission status: ${late ? 'LATE' : 'ON TIME'}`);
        
        // Calculate final score
        const finalScore = calculateFinalScore(submission, assignment);
        const percentage = (finalScore / assignment.points_possible);
        
        console.log(`    Final score used: ${finalScore}/${assignment.points_possible}`);
        console.log(`    Percentage: ${(percentage * 100).toFixed(1)}% (${percentage.toFixed(3)})`);
        
        // Add to result object
        result[assignment.id.toString()] = parseFloat(percentage.toFixed(3));
        
        // Update totals
        totalScore += finalScore;
        totalPossible += assignment.points_possible;
        validAssignmentCount++;
        
        console.log(`    Running total: ${totalScore}/${totalPossible} points`);
      }
      
      // Calculate average
      console.log(`\n  SUMMARY FOR LEARNER ${learnerId}:`);
      console.log(`  Valid assignments processed: ${validAssignmentCount}`);
      console.log(`  Total score: ${totalScore}`);
      console.log(`  Total possible: ${totalPossible}`);
      
      if (totalPossible > 0) {
        const average = totalScore / totalPossible;
        result.avg = parseFloat(average.toFixed(3));
        console.log(`  Overall average: ${(average * 100).toFixed(1)}% (${result.avg})`);
      } else {
        console.log(`  No valid assignments found for this learner`);
      }
      
      results.push(result);
      console.log(`\n  Result object for learner ${learnerId}:`);
      console.log(`  ${JSON.stringify(result, null, 2).replace(/\n/g, '\n  ')}`);
    }
    
    console.log("\n" + "=".repeat(60));
    console.log("FINAL PROCESSING RESULTS");
    console.log("=".repeat(60));
    console.log(`Total learners processed: ${results.length}`);
    
    // Show detailed breakdown
    console.log("\nDETAILED BREAKDOWN BY LEARNER:");
    results.forEach(result => {
      console.log(`\nLearner ${result.id}:`);
      console.log(`  Overall Average: ${(result.avg * 100).toFixed(1)}%`);
      
      // Show individual assignment scores
      Object.keys(result).forEach(key => {
        if (key !== 'id' && key !== 'avg') {
          const assignment = ag.assignments.find(a => a.id === parseInt(key));
          if (assignment) {
            console.log(`  ${assignment.name} (ID: ${key}): ${(result[key] * 100).toFixed(1)}%`);
          }
        }
      });
    });
    
   
    
  } catch (error) {
    console.error("\n ERROR PROCESSING DATA:");
    console.error(error.message);
    throw error;
  }
}

// Test the function
console.log("RUNNING LEARNER DATA PROCESSOR");
console.log("=".repeat(60));

try {
  const processedData = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  

  // Expected output based on calculations
  console.log("\n" + "=".repeat(60));
  console.log("EXPECTED OUTPUT:");
  console.log("=".repeat(60));
  console.log(`Expected output for Learner 125: {
  "id": 125,
  "avg": 0.985,
  "1": 0.94,
  "2": 1.0
}`);
  console.log(`\nExpected output for Learner 132: {
  "id": 132,
  "avg": 0.82,
  "1": 0.78,
  "2": 0.833
}`);
  
} catch (error) {
  console.error("\nProgram failed with error:", error.message);
}