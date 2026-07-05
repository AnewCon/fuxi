import { readFileSync } from 'fs';

const text = readFileSync('思想政治/思想政治/题库.txt', 'utf-8');
const lines = text.split('\n');

const questions = [];
let current = null;

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed) continue;

  // Match question number: **第N题** or 第 N 题
  const qMatch = trimmed.match(/\*{0,2}第\s*(\d+)\s*题\*{0,2}/);
  if (qMatch) {
    if (current && current.content && current.answer && current.options.length > 0) {
      questions.push(current);
    }
    current = { id: parseInt(qMatch[1]), content: '', options: [], answer: '', type: 'single' };
    continue;
  }

  // Match answer
  const aMatch = trimmed.match(/\*{0,2}(?:正确|参考)?答案[：:]\s*([对错A-Da-d]+)\*{0,2}/);
  if (aMatch) {
    current.answer = aMatch[1].toUpperCase();
    continue;
  }

  // Match option
  const oMatch = trimmed.match(/^([A-Da-d])[.、]\s*(.*)$/);
  if (oMatch && current) {
    current.options.push({ label: oMatch[1].toUpperCase(), text: oMatch[2].trim() });
    continue;
  }

  // Content
  if (current && !current.content) {
    current.content = trimmed;
  } else if (current && current.content && current.options.length === 0) {
    current.content += ' ' + trimmed;
  }
}
if (current && current.content && current.answer && current.options.length > 0) {
  questions.push(current);
}

// Detect type
for (const q of questions) {
  if (q.answer === '对' || q.answer === '错') q.type = 'judge';
  else if (q.answer.length > 1) q.type = 'multiple';
  else if (q.options.length === 2 && q.options.some(o => o.text === '对') && q.options.some(o => o.text === '错')) q.type = 'judge';
  else q.type = 'single';
}

console.log(`Parsed ${questions.length} questions`);

// Generate TypeScript
let code = `export type QuestionType = 'single' | 'multiple' | 'judge'\n\n`;
code += `export interface Question {\n  id: number\n  type: QuestionType\n  content: string\n  options: { label: string; text: string }[]\n  answer: string\n  analysis?: string\n}\n\n`;
code += `// 思政复习题 - 共${questions.length}题\n`;
code += `export const defaultQuestions: Question[] = [\n`;

for (const q of questions) {
  code += `  {\n    id: ${q.id}, type: '${q.type}',\n    content: ${JSON.stringify(q.content)},\n    options: ${JSON.stringify(q.options)},\n    answer: ${JSON.stringify(q.answer)},\n  },\n`;
}

code += `]\n`;

import { writeFileSync } from 'fs';
writeFileSync('quiz-app/src/data/questions.ts', code, 'utf-8');
console.log('Done! Written to quiz-app/src/data/questions.ts');
