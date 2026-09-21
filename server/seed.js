const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Team = require('./models/Team');
const Round = require('./models/Round');
const Question = require('./models/Question');
const Submission = require('./models/Submission');

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ciphercase';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collections
    await Team.deleteMany({});
    await Round.deleteMany({});
    await Question.deleteMany({});
    await Submission.deleteMany({});

    console.log('Cleared existing data.');

    // 1. Create Admin Account
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    await Team.create({
      teamId: 'ADMIN',
      teamName: 'Cipher Case Admin',
      password: adminPasswordHash,
      members: ['Event Admin'],
      role: 'admin'
    });
    console.log('Created Admin account (ADMIN / admin123)');

    // 2. Create 30 Teams (TEAM001 to TEAM030)
    const teamsToInsert = [];
    for (let i = 1; i <= 30; i++) {
      const numStr = i.toString().padStart(3, '0');
      const teamId = `TEAM${numStr}`;
      const plainPassword = `team${numStr}`;
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      teamsToInsert.push({
        teamId,
        teamName: `Detectives Team ${numStr}`,
        password: hashedPassword,
        members: [`Investigator A (${teamId})`, `Investigator B (${teamId})`],
        currentRound: 1,
        status: 'active',
        qualifiedRound2: false,
        qualifiedRound3: false,
        role: 'team'
      });
    }

    await Team.insertMany(teamsToInsert);
    console.log('Created 30 Teams (TEAM001 to TEAM030)');

    // 3. Create 3 Rounds
    await Round.insertMany([
      {
        roundNumber: 1,
        title: 'ROUND 1 – IDENTIFY THE CASE',
        duration: 15, // 15 minutes
        status: 'not_started',
        resultsPublished: false
      },
      {
        roundNumber: 2,
        title: 'ROUND 2 – TRACE THE CLUES',
        duration: 20, // 20 minutes
        status: 'not_started',
        resultsPublished: false
      },
      {
        roundNumber: 3,
        title: 'ROUND 3 – CRACK THE CASE',
        duration: 25, // 25 minutes
        status: 'not_started',
        resultsPublished: false
      }
    ]);
    console.log('Created 3 Event Rounds');

    // 4. Create Round 1 Questions (10 questions, 5 marks each = 50 total)
    const round1Questions = [
      {
        roundNumber: 1,
        questionNumber: 1,
        questionText: 'What was the main missing item from the organizing room?',
        type: 'multiple_choice',
        options: ['A. The event file', 'B. The laptop', 'C. The registration register', 'D. The camera lens'],
        correctAnswer: 'A. The event file',
        marks: 5
      },
      {
        roundNumber: 1,
        questionNumber: 2,
        questionText: 'At what time was the file first confirmed to be present on the desk?',
        type: 'multiple_choice',
        options: ['A. 5:15 PM', 'B. 5:45 PM', 'C. 6:05 PM', 'D. 6:18 PM'],
        correctAnswer: 'B. 5:45 PM',
        marks: 5
      },
      {
        roundNumber: 1,
        questionNumber: 3,
        questionText: 'Which event happened immediately before the power outage?',
        type: 'multiple_choice',
        options: ['A. Aarav left the room', 'B. Meera entered the room at 6:05 PM', 'C. Karthik took a photo', 'D. The file was noticed missing'],
        correctAnswer: 'B. Meera entered the room at 6:05 PM',
        marks: 5
      },
      {
        roundNumber: 1,
        questionNumber: 4,
        questionText: 'Which suspect\'s statement should be investigated further because of the photograph evidence?',
        type: 'multiple_choice',
        options: ['A. Aarav\'s statement', 'B. Meera\'s statement', 'C. Karthik\'s statement', 'D. The volunteer\'s statement'],
        correctAnswer: 'C. Karthik\'s statement',
        marks: 5
      },
      {
        roundNumber: 1,
        questionNumber: 5,
        questionText: 'What time does the photograph indicate that someone was inside the room?',
        type: 'multiple_choice',
        options: ['A. 6:00 PM', 'B. 6:12 PM', 'C. 6:25 PM', 'D. 5:55 PM'],
        correctAnswer: 'B. 6:12 PM',
        marks: 5
      },
      {
        roundNumber: 1,
        questionNumber: 6,
        questionText: 'Which evidence is most useful for reconstructing the sequence of events?',
        type: 'multiple_choice',
        options: ['A. The color of the room', 'B. The timeline', 'C. The weather', 'D. The event poster'],
        correctAnswer: 'B. The timeline',
        marks: 5
      },
      {
        roundNumber: 1,
        questionNumber: 7,
        questionText: 'If the file was present at 5:45 PM and missing at 6:25 PM, what is the most reasonable conclusion?',
        type: 'multiple_choice',
        options: [
          'A. The file disappeared before 5:00 PM',
          'B. The file disappeared sometime between 5:45 PM and 6:25 PM',
          'C. The file never existed',
          'D. The file was destroyed at 7:00 PM'
        ],
        correctAnswer: 'B. The file disappeared sometime between 5:45 PM and 6:25 PM',
        marks: 5
      },
      {
        roundNumber: 1,
        questionNumber: 8,
        questionText: 'Which two pieces of evidence appear to directly conflict with each other?',
        type: 'multiple_choice',
        options: [
          'A. Aarav\'s statement and Meera\'s statement',
          'B. Karthik\'s statement and the 6:12 PM photograph',
          'C. The power blackout and Meera\'s entry',
          'D. 5:45 PM timeline and Aarav\'s exit'
        ],
        correctAnswer: 'B. Karthik\'s statement and the 6:12 PM photograph',
        marks: 5
      },
      {
        roundNumber: 1,
        questionNumber: 9,
        questionText: 'Should the investigation team immediately accuse Karthik based only on this initial evidence?',
        type: 'multiple_choice',
        options: ['A. Yes', 'B. No, more evidence is needed.'],
        correctAnswer: 'B. No, more evidence is needed.',
        marks: 5
      },
      {
        roundNumber: 1,
        questionNumber: 10,
        questionText: 'What should investigators do next to solve the mystery?',
        type: 'multiple_choice',
        options: [
          'A. Ignore the evidence',
          'B. Check additional CCTV/witness evidence',
          'C. Delete the photograph',
          'D. Close the case immediately'
        ],
        correctAnswer: 'B. Check additional CCTV/witness evidence',
        marks: 5
      }
    ];

    // 5. Create Round 2 Questions (8 questions, 50 marks total)
    const round2Questions = [
      {
        roundNumber: 2,
        questionNumber: 1,
        questionText: 'What is the correct chronological order of the initial events in Round 2?',
        type: 'multiple_choice',
        options: [
          'A. Note found -> Email received -> Message opened',
          'B. Email received (7:05 PM) -> Message opened (7:08 PM) -> Note decoded',
          'C. Message opened -> Email received -> Note found',
          'D. Note decoded -> Message opened -> Email received'
        ],
        correctAnswer: 'B. Email received (7:05 PM) -> Message opened (7:08 PM) -> Note decoded',
        marks: 6,
        hintText: 'Look carefully at the timestamps in Evidence 01 & 02.',
        hintPenalty: 2
      },
      {
        roundNumber: 2,
        questionNumber: 2,
        questionText: 'What word does the sequence "3 – 1 – 20 – 5" decode to using the A=1 to Z=26 substitution cipher?',
        type: 'multiple_choice',
        options: ['A. CATE', 'B. CODE', 'C. CASE', 'D. BAUD'],
        correctAnswer: 'A. CATE',
        marks: 6,
        hintText: '3=C, 1=A, 20=T, 5=E.',
        hintPenalty: 2
      },
      {
        roundNumber: 2,
        questionNumber: 3,
        questionText: 'Which suspect\'s registered device MAC address matches the server remote access connection log?',
        type: 'multiple_choice',
        options: ['A. Aarav', 'B. Meera', 'C. Karthik', 'D. Unknown Guest'],
        correctAnswer: 'C. Karthik',
        marks: 6,
        hintText: 'Compare the MAC address in the QR Clue with Karthik\'s photography laptop.',
        hintPenalty: 2
      },
      {
        roundNumber: 2,
        questionNumber: 4,
        questionText: 'At what exact time was the remote access connection established according to the server log (QR Clue / Evidence 04)?',
        type: 'multiple_choice',
        options: ['A. 6:12 PM', 'B. 7:05 PM', 'C. 7:06 PM', 'D. 7:08 PM'],
        correctAnswer: 'C. 7:06 PM',
        marks: 6,
        hintText: 'Inspect Server IP Log Entry #882 in Evidence 04.',
        hintPenalty: 2
      },
      {
        roundNumber: 2,
        questionNumber: 5,
        questionText: 'What major contradiction is revealed when comparing Karthik\'s statement with the server Wi-Fi log?',
        type: 'multiple_choice',
        options: [
          'A. Karthik was not on campus',
          'B. Karthik claimed he didn\'t use Wi-Fi, but his MAC address connected at 7:06 PM',
          'C. The email was sent from Meera\'s phone',
          'D. Aarav was taking photos'
        ],
        correctAnswer: 'B. Karthik claimed he didn\'t use Wi-Fi, but his MAC address connected at 7:06 PM',
        marks: 6,
        hintText: 'Match Karthik\'s testimony against the server timestamp at 7:06 PM.',
        hintPenalty: 2
      },
      {
        roundNumber: 2,
        questionNumber: 6,
        questionText: 'Which lead should investigators prioritize to trace how the event file was extracted?',
        type: 'multiple_choice',
        options: [
          'A. The refreshment stall menu',
          'B. The Wi-Fi access point logs and file transfer directory',
          'C. The color of the laptop bag',
          'D. Aarav\'s badge'
        ],
        correctAnswer: 'B. The Wi-Fi access point logs and file transfer directory',
        marks: 6,
        hintText: 'Follow digital breadcrumbs on the network.',
        hintPenalty: 2
      },
      {
        roundNumber: 2,
        questionNumber: 7,
        questionText: 'Which conclusion is supported by ALL available evidence in Round 2?',
        type: 'multiple_choice',
        options: [
          'A. The system was hacked from another country',
          'B. A local device connected via Wi-Fi at 7:06 PM right after the email arrived',
          'C. The note was written by the dean',
          'D. Meera deleted all the event files'
        ],
        correctAnswer: 'B. A local device connected via Wi-Fi at 7:06 PM right after the email arrived',
        marks: 7,
        hintText: 'Combine the email timestamp (7:05 PM) and server connection (7:06 PM).',
        hintPenalty: 2
      },
      {
        roundNumber: 2,
        questionNumber: 8,
        questionText: 'Based on the clues in Round 2, whose device initiated the network file access at 7:06 PM?',
        type: 'multiple_choice',
        options: ['A. Karthik\'s device', 'B. Aarav', 'C. Meera', 'D. Security Team'],
        correctAnswer: 'A. Karthik\'s device',
        marks: 7,
        hintText: 'The MAC address ending in :3F:A1 belongs to Karthik.',
        hintPenalty: 2
      }
    ];

    // 6. Create Round 3 Questions (5 major tasks, 20 marks each = 100 total)
    const round3Questions = [
      {
        roundNumber: 3,
        questionNumber: 1,
        questionText: 'TASK 1: Identify the earliest suspicious event in the master case file.',
        type: 'multiple_choice',
        options: [
          'A. Unregistered duplicate key creation before 5:30 PM',
          'B. File placed on desk at 5:45 PM',
          'C. Aarav leaving at 5:55 PM',
          'D. Power outage at 6:10 PM'
        ],
        correctAnswer: 'A. Unregistered duplicate key creation before 5:30 PM',
        marks: 20
      },
      {
        roundNumber: 3,
        questionNumber: 2,
        questionText: 'TASK 2: Find the key contradiction between the suspect statements in the case file.',
        type: 'multiple_choice',
        options: [
          'A. Aarav claimed he never returned, but door log shows his ID card scanned at 6:11 PM during blackout',
          'B. Meera said she was alone, but Karthik said he was inside',
          'C. Karthik said he was taking photos outside, but photo timestamp shows 6:12 PM inside organizing room',
          'D. Both A and C contain critical contradictions'
        ],
        correctAnswer: 'D. Both A and C contain critical contradictions',
        marks: 20
      },
      {
        roundNumber: 3,
        questionNumber: 3,
        questionText: 'TASK 3: Decode the hidden message found inside the partition audit log: "20 - 15 - 16 - 19 - 5 - 3 - 18 - 5 - 20".',
        type: 'multiple_choice',
        options: ['A. TOPSECRET', 'B. CIPHERCASE', 'C. PASSCODE', 'D. EVIDENCE'],
        correctAnswer: 'A. TOPSECRET',
        marks: 20
      },
      {
        roundNumber: 3,
        questionNumber: 4,
        questionText: 'TASK 4: What is the exact chronological sequence of events leading to the missing file?',
        type: 'multiple_choice',
        options: [
          'A. Duplicate key created -> File placed -> Power outage -> Photo taken inside -> Remote Wi-Fi access',
          'B. Power outage -> File placed -> Duplicate key created -> Remote Wi-Fi access',
          'C. Remote Wi-Fi access -> File placed -> Power outage -> Photo taken',
          'D. Photo taken -> Duplicate key created -> Power outage -> File placed'
        ],
        correctAnswer: 'A. Duplicate key created -> File placed -> Power outage -> Photo taken inside -> Remote Wi-Fi access',
        marks: 20
      },
      {
        roundNumber: 3,
        questionNumber: 5,
        questionText: 'TASK 5: Based on ALL physical, digital, timeline, and statement evidence, choose the final conclusion best supported by the facts.',
        type: 'multiple_choice',
        options: [
          'A. Aarav and Karthik acted together using the power outage window to access the organizing room and move the file',
          'B. Meera stole the file alone during registration',
          'C. The file was lost due to a server software glitch',
          'D. An outsider entered without any campus credentials'
        ],
        correctAnswer: 'A. Aarav and Karthik acted together using the power outage window to access the organizing room and move the file',
        marks: 20
      }
    ];

    await Question.insertMany([...round1Questions, ...round2Questions, ...round3Questions]);
    console.log('Created all Questions for Rounds 1, 2, and 3');

    console.log('====================================================');
    console.log(' DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('====================================================');
    process.exit(0);

  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
