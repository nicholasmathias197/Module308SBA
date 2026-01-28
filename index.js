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
  // Display input submissions in the requested format
  submissions.forEach(sub => {
    console.log(`learner_id: ${sub.learner_id},`);
    console.log(`assignment_id: ${sub.assignment_id},`);
    console.log(`submission { submitted_at: '${sub.submission.submitted_at}', score: ${sub.submission.score} }`);
    console.log("");
  });
  
  let results = [];
  
  try {
    // Validate course assignment group match
    if (ag.course_id !== course.id) {
      throw new Error(`Assignment group course_id (${ag.course_id}) does not match course id (${course.id})`);
    }
    
    const currentDate = new Date();
    
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
        const penalty = assignment.points_possible * 0.10;
        finalScore = Math.max(0, finalScore - penalty);
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
    
    // Process each learner
    for (const learnerId of learnerIds) {
      const result = {
        id: learnerId,
        avg: 0
      };
      
      let totalScore = 0;
      let totalPossible = 0;
      
      // Get all submissions for this learner
      const learnerSubmissions = submissions.filter(s => s.learner_id === learnerId);
      
      for (const submission of learnerSubmissions) {
        const assignment = findAssignment(submission.assignment_id);
        
        if (!assignment) {
          continue;
        }
        
        // Check if assignment is due
        if (!isAssignmentDue(assignment)) {
          continue;
        }
        
        // Check for valid points_possible
        if (!assignment.points_possible || assignment.points_possible <= 0) {
          continue;
        }
        
        // Calculate final score
        const finalScore = calculateFinalScore(submission, assignment);
        const percentage = (finalScore / assignment.points_possible);
        
        // Add to result object
        result[assignment.id.toString()] = parseFloat(percentage.toFixed(3));
        
        // Update totals
        totalScore += finalScore;
        totalPossible += assignment.points_possible;
      }
      
      // Calculate average
      if (totalPossible > 0) {
        const average = totalScore / totalPossible;
        result.avg = parseFloat(average.toFixed(5));
      }
      
      results.push(result);
    }
    
    // Display final results
    console.log("");
    results.forEach(result => {
      const parts = [];
      
      // Add assignment percentages (as strings)
      Object.keys(result).forEach(key => {
        if (key !== 'id' && key !== 'avg') {
          parts.push(`${key}: '${result[key].toFixed(2).replace('.00', '').replace('.0', '')}'`);
        }
      });
      
      // Add id and avg at the end
      parts.push(`id: ${result.id}`);
      parts.push(`avg: ${result.avg.toFixed(5)}`);
      
      console.log(`{${parts.join(' ')}}`);
    });
    
    return results;
    
  } catch (error) {
    throw error;
  }
}

// Run the function
getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);