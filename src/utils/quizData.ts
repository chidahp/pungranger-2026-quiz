export type Question = {
  id: number;
  question: string;
  options: [string, string];
  correctIndex: 0 | 1;
};

export const QUIZ_DATA: Question[] = [
  {
    id: 1,
    question: "ถ้าร้องเพลงในห้องครัว",
    options: ["จะได้ผัวแก่ เมียแก่", "จะได้เป็นนักร้อง"],
    correctIndex: 0,
  },
  {
    id: 2,
    question: "ถ้าเอานิ้วชี้ สายรุ้ง",
    options: ["เอาเข้าปาก", "เอาไปจิ้มตูด"],
    correctIndex: 1,
  },
  {
    id: 3,
    question: "สิ่งที่คุณเฝ้ารอมากที่สุดในวันที่ 1",
    options: ["เงินเดือน", "หวยออก"],
    correctIndex: 1,
  },
  {
    id: 4,
    question: "ชีวิตมันต้องเดินตามหา",
    options: ["ความฝัน", "วันพีซ"],
    correctIndex: 0,
  },
  {
    id: 5,
    question:
      "ถ้ามีคอลเซ็นเตอร์โทรมาบอกว่า มีพัสดุตกค้าง ให้โอนเงินเพื่อรับของ คุณจะ…",
    options: ["แจ้งตำรวจมาจับ", "ขอสมัครงานเป็นคอลเซ็นเตอร์ด้วย"],
    correctIndex: 1,
  },
  {
    id: 6,
    question: "นิทานเรื่องใด สอนว่าถ้าโกหกบ่อย ๆ คนจะไม่เชื่อ",
    options: ["เด็กเลี้ยงแกะ", "เพื่อนเลี้ยงเบียร์"],
    correctIndex: 0,
  },
  {
    id: 7,
    question: "ถ้าเพื่อนบอกว่า รอบนี้จะไม่กลับไปหาเขาแล้ว คุณจะเสิร์ชหา…",
    options: ["วิธีมูให้เพื่อนได้แฟนใหม่ดี ๆ", "อาหารหมายี่ห้อไหนคนกินแล้วอร่อย"],
    correctIndex: 0,
  },
  {
    id: 8,
    question:
      "ถ้ามีคนสวนหน้าสวยผิวพรรณดี แต่มีหนวด มาสมัครงานที่คฤหาสน์ประจำตระกูลของคุณ ความจริงแล้วเขาอาจเป็น..",
    options: ["ทายาทที่แท้จริงของตระกูล", "คนสวนที่เคยเป็นพรีเซ็นเตอร์ครีมบำรุงผิว"],
    correctIndex: 1,
  },
  {
    id: 9,
    question: "ถ้าคนในตี้เล่นเกมบอกว่า ตาสุดท้าย เราจะได้นอนในอีก…",
    options: ["5 นาที", "5 ชั่วโมง"],
    correctIndex: 0,
  },
  {
    id: 10,
    question: "คุณคิดว่าชีวิตจะดีขึ้นได้ เพราะ…",
    options: ["วางแผนชีวิต", "ดูดวงก่อน แล้วค่อยวางแผน"],
    correctIndex: 0,
  },
];

export function getRandomQuestions(
  data: Question[],
  count: number
): Question[] {
  if (count >= data.length) return [...data];
  const pool = [...data];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}
