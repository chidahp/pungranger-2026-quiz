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
  {
    id: 11,
    question: 'หอแต๋วแตกภาคล่าสุด เป็นภาคสุดท้าย',
    options: ['เสียดายจัง อดดูเลย', 'ลอ ตู แส หลู'],
    correctIndex: 0,
  },
  {
    id: 12,
    question: 'อยากเจอผีต้องดูที่ไหน',
    options: ['บนตาราง อยู่เหนือหงส์', 'มองใต้หว่างขา'],
    correctIndex: 1,
  },
  {
    id: 13,
    question: 'ถ้าแม่บอกว่า “ตื่นได้แล้ว จะ 9 โมงแล้ว!!” แปลว่าตอนนี้เวลา…',
    options: ['6:50 น.', '8:50 น.'],
    correctIndex: 0,
  },
  {
    id: 14,
    question: 'เวลาเดินผ่านผู้ใหญ่ ควรทำอย่างไร',
    options: ['ก้มตัวลงข้างหน้า', 'แอ่นหลังแบบเดอะ เมทริกซ์'],
    correctIndex: 1,
  },
  {
    id: 15,
    question: 'อะไรอยู่ในตู้เต่าบิน',
    options: ['เต่านั่งชงน้ำ', 'ป้านั่งชงน้ำ'],
    correctIndex: 0,
  },
  {
    id: 16,
    question: 'ทำยังไงให้หมาไม่กัด',
    options: ['กัดหมาก่อน', 'เดินตามหลังผู้ใหญ่'],
    correctIndex: 1,
  },
  {
    id: 17,
    question: 'ใกล้ถึงแล้ว แปลว่า',
    options: ['อยู่ไม่ไกลจากที่หมาย', 'อยู่ไม่ไกลจากเตียงนอน'],
    correctIndex: 0
  },
  {
    id: 18,
    question: 'เรียนสูง ๆ จบไปจะได้เป็นอะไร',
    options: ['เจ้าคนนายคน', 'เจ้ามือ'],
    correctIndex: 0
  },
  {
    id: 19,
    question: 'แท็กซี่สนามบิน เรทคนไทยและต่างชาติเท่ากันหรือไม่',
    options: ['เท่าสิ', 'เท่าาาาาาาาว์ แหละะะ จะไม่เท่าได้งัย'],
    correctIndex: 0
  },
  {
    id: 20,
    question: 'เด็กสายศิลป์ คือ',
    options: ['เด็กที่สอบเข้าสายวิทย์ไม่ได้', 'เด็กที่สนใจคณะทางศิลปศาสตร์'],
    correctIndex: 0
  },
  {
    id: 21,
    question: 'เนื้อสัตว์แปลกๆ ที่เราไม่เคยกินมักจะมีรสชาติแบบใด',
    options: ['จะรู้ได้ไง ก็ไม่เคยกิน', 'เหมือนไก่ ผู้ใหญ่บอก'],
    correctIndex: 1
  },
  {
    id: 22,
    question: 'ตายแล้วไปไหน',
    options: ['นรก / สวรรค์ ตามกรรมที่ทำมา', 'ไปไหนก็ได้ แต่ก็ต้องทำงานอยู่ดี'],
    correctIndex: 0
  },
  {
    id: 23,
    question: 'เจอรถเต่าต้องทำอะไร',
    options: ['หยิก', 'ขับแซง'],
    correctIndex: 0
  },
  {
    id: 24,
    question: 'ไบรอั้น มาจากที่ไหน',
    options: ['ประเทศเกาหลี อายุยี่สิบสี่', 'ชื่อฝรั่ง น่าจะยุโรป'],
    correctIndex: 0
  },
  {
    id: 25,
    question: 'เพื่อนที่บอกว่าไม่เมาควรอยู่ที่ไหน',
    options: ['นั่งอยู่ที่โต๊ะ', 'นอนอยู่ที่พื้น'],
    correctIndex: 0
  },
  {
    id: 26,
    question: '"ลดราคาวันสุดท้าย" คือวันไหน',
    options: ['วันนี้', 'ทุกวัน'],
    correctIndex: 0
  },
  {
    id: 27,
    question: 'งานหนังสือรอบนี้ ชี้ดาบออกใหม่ 5 เล่ม',
    options: ['พร้อมซื้อ', 'อาจจะยังน้า'],
    correctIndex: 1
  },
  {
    id: 28,
    question: 'ข้าวผัดอเมริกัน มาจากประเทศ',
    options: ['สหรัฐอเมริกา', 'ไทย'],
    correctIndex: 0
  },
  {
    id: 29,
    question: 'ข้อเสียของการสัก ก็คืออออ...',
    options: ['เจ็บ', 'อดเป็นข้าราชการ'],
    correctIndex: 1
  },
  {
    id: 30,
    question: 'ในกระป๋องคุกกี้อาร์เซนอลมีอะไร',
    options: ['คุกกี้อาร์เซนอล', 'เข็มกับด้าย'],
    correctIndex: 0
  }
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getRandomQuestions(
  data: Question[],
  count: number
): Question[] {
  const unique = shuffle(data);
  if (count >= unique.length) return unique;
  return unique.slice(0, count);
}
