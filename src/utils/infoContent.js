// Bilingual (English/Urdu) content for the Info & Knowledge cards.
// Each topic has numbered `sections` (heading + body) per language,
// plus a short `spoken` summary for the Listen button.
export const INFO_CONTENT = {
  "Normal Range of Blood Pressure": {
    en: {
      sections: [
        {
          heading: "1. Why ranges matter",
          body: "Blood pressure is measured with two numbers — systolic (top) and diastolic (bottom). Doctors use standard ranges to classify readings, because a single number in isolation doesn't tell the full story of your cardiovascular health.",
        },
        {
          heading: "2. Normal range",
          body: "If your readings are consistently higher than 90/60 mmHg and lower than 120/80 mmHg, your blood pressure is normal. Maintain a healthy lifestyle to keep it that way, especially if hypertension runs in your family.",
        },
        {
          heading: "3. Elevated",
          body: "When your blood pressure is higher than normal but hasn't reached 130/80 mmHg, it's considered elevated. Without lifestyle improvements, this often progresses to high blood pressure over time.",
        },
        {
          heading: "4. Hypertension — Stage 1",
          body: "Consistent systolic readings of 130-139 mmHg or diastolic readings of 80-89 mmHg mean Stage 1. Lifestyle changes are usually the first step; medication may be added if your cardiovascular risk is high.",
        },
        {
          heading: "5. Hypertension — Stage 2",
          body: "Stage 2 means consistent systolic readings of 140-180 mmHg or diastolic readings of 90-120 mmHg. This typically calls for lifestyle changes combined with medication, with follow-up testing in 3-6 months.",
        },
        {
          heading: "6. Hypertensive Crisis",
          body: "A systolic reading over 180 mmHg or diastolic over 120 mmHg is a hypertensive crisis. Rest and retest after a few minutes — if it stays in this range, don't hesitate to call emergency services or go to the hospital.",
        },
      ],
      spoken:
        "Normal blood pressure is between 90 over 60 and 120 over 80. Elevated is just above that. Stage 1 hypertension starts at 130 over 80. Stage 2 starts at 140 over 90. Above 180 over 120 is a hypertensive crisis needing urgent care.",
    },
    ur: {
      sections: [
        {
          heading: "1. رینج کیوں اہم ہے",
          body: "بلڈ پریشر دو نمبروں سے ناپا جاتا ہے — سسٹولک (اوپر) اور ڈائیسٹولک (نیچے)۔ ڈاکٹر ریڈنگز کی درجہ بندی کے لیے معیاری رینجز استعمال کرتے ہیں کیونکہ اکیلا نمبر آپ کی مکمل دل کی صحت نہیں بتاتا۔",
        },
        {
          heading: "2. نارمل رینج",
          body: "اگر آپ کی ریڈنگز مسلسل 90/60 mmHg سے زیادہ اور 120/80 mmHg سے کم ہوں تو آپ کا بلڈ پریشر نارمل ہے۔ صحت مند طرزِ زندگی برقرار رکھیں، خاص طور پر اگر خاندان میں ہائی بلڈ پریشر کی تاریخ ہو۔",
        },
        {
          heading: "3. قدرے بلند",
          body: "جب بلڈ پریشر نارمل سے زیادہ ہو مگر 130/80 mmHg تک نہ پہنچے تو یہ قدرے بلند شمار ہوتا ہے۔ طرزِ زندگی میں بہتری کے بغیر یہ اکثر وقت کے ساتھ ہائی بلڈ پریشر میں بدل جاتا ہے۔",
        },
        {
          heading: "4. ہائی بلڈ پریشر — مرحلہ 1",
          body: "مسلسل سسٹولک ریڈنگز 130-139 mmHg یا ڈائیسٹولک 80-89 mmHg مرحلہ 1 ظاہر کرتی ہیں۔ عام طور پر پہلے طرزِ زندگی میں بہتری لائی جاتی ہے؛ زیادہ خطرے کی صورت میں دوا بھی شامل کی جا سکتی ہے۔",
        },
        {
          heading: "5. ہائی بلڈ پریشر — مرحلہ 2",
          body: "مرحلہ 2 میں مسلسل سسٹولک 140-180 mmHg یا ڈائیسٹولک 90-120 mmHg ہوتا ہے۔ اس میں عام طور پر طرزِ زندگی اور دوا دونوں درکار ہوتے ہیں، 3 سے 6 ماہ بعد دوبارہ چیک اپ کے ساتھ۔",
        },
        {
          heading: "6. ہائپرٹینسِو بحران",
          body: "180 mmHg سے زیادہ سسٹولک یا 120 mmHg سے زیادہ ڈائیسٹولک ہائپرٹینسِو بحران ہے۔ آرام کریں اور چند منٹ بعد دوبارہ چیک کریں — اگر یہ اسی رینج میں رہے تو فوراً ایمرجنسی سروس کو کال کریں یا ہسپتال جائیں۔",
        },
      ],
      spoken:
        "نارمل بلڈ پریشر 90 بٹا 60 اور 120 بٹا 80 کے درمیان ہے۔ مرحلہ 1 ہائی بلڈ پریشر 130 بٹا 80 سے شروع ہوتا ہے۔ مرحلہ 2، 140 بٹا 90 سے۔ 180 بٹا 120 سے زیادہ ہائپرٹینسِو بحران ہے جسے فوری علاج درکار ہے۔",
    },
  },

  "What is Blood Pressure?": {
    en: {
      sections: [
        {
          heading: "1. The basic idea",
          body: "Blood pressure measures the force of blood pushing against the walls of your arteries as your heart pumps it around your body.",
        },
        {
          heading: "2. Systolic vs diastolic",
          body: "The top number (systolic) is the pressure when your heart contracts and pushes blood out. The bottom number (diastolic) is the pressure when your heart relaxes between beats.",
        },
        {
          heading: "3. Why mmHg?",
          body: "Blood pressure is measured in millimeters of mercury (mmHg) — a unit inherited from the original mercury-column devices doctors used, even though most modern devices are digital.",
        },
        {
          heading: "4. Why it changes",
          body: "Blood pressure naturally rises and falls throughout the day based on activity, stress, temperature, caffeine, and even your posture — which is why doctors look at patterns, not single readings.",
        },
      ],
      spoken:
        "Blood pressure measures the force of blood against your artery walls. The top number is the pressure when your heart beats. The bottom number is the pressure when your heart rests between beats.",
    },
    ur: {
      sections: [
        {
          heading: "1. بنیادی تصور",
          body: "بلڈ پریشر خون کی اس قوت کو ناپتا ہے جو دل کے پمپ کرنے پر جسم بھر میں شریانوں کی دیواروں پر پڑتی ہے۔",
        },
        {
          heading: "2. سسٹولک بمقابلہ ڈائیسٹولک",
          body: "اوپر والا نمبر (سسٹولک) دل کے سکڑنے اور خون باہر دھکیلنے کے وقت کا دباؤ ہے۔ نیچے والا نمبر (ڈائیسٹولک) دھڑکنوں کے درمیان آرام کے وقت کا دباؤ ہے۔",
        },
        {
          heading: "3. mmHg کیوں؟",
          body: "بلڈ پریشر ملی میٹر مرکری (mmHg) میں ناپا جاتا ہے — یہ اکائی پرانے مرکری کالم آلات سے وراثت میں ملی، اگرچہ اب زیادہ تر آلات ڈیجیٹل ہیں۔",
        },
        {
          heading: "4. یہ کیوں بدلتا ہے",
          body: "بلڈ پریشر دن بھر سرگرمی، تناؤ، درجہ حرارت، کیفین، اور جسمانی حالت کے ساتھ قدرتی طور پر بدلتا ہے — اسی لیے ڈاکٹر ایک ریڈنگ کی بجائے پیٹرن دیکھتے ہیں۔",
        },
      ],
      spoken:
        "بلڈ پریشر خون کی اس قوت کو ناپتا ہے جو شریانوں کی دیواروں پر پڑتی ہے۔ اوپر والا نمبر دھڑکن کے وقت کا دباؤ ہے، نیچے والا آرام کے وقت کا۔",
    },
  },

  "Find Your Blood Pressure Type": {
    en: {
      sections: [
        {
          heading: "1. Six categories",
          body: "Blood pressure readings generally fall into one of six categories: Low, Normal, Elevated, Hypertension Stage 1, Hypertension Stage 2, or Hypertensive Crisis.",
        },
        {
          heading: "2. Which number counts",
          body: "Your category is based on whichever number — systolic or diastolic — falls into the higher-risk range. For example, 135/78 counts as Stage 1 because of the systolic number alone.",
        },
        {
          heading: "3. Why tracking helps",
          body: "Tracking your readings over time in this app helps you and your doctor see your typical range, rather than reacting to any single reading that might be a one-off spike.",
        },
      ],
      spoken:
        "Blood pressure readings fall into six categories: Low, Normal, Elevated, Stage 1, Stage 2, or Hypertensive Crisis. Your category is based on whichever number, systolic or diastolic, is higher risk.",
    },
    ur: {
      sections: [
        {
          heading: "1. چھ زمرے",
          body: "بلڈ پریشر ریڈنگز عام طور پر چھ زمروں میں آتی ہیں: کم، نارمل، قدرے بلند، ہائی بلڈ پریشر مرحلہ 1، مرحلہ 2، یا ہائپرٹینسِو بحران۔",
        },
        {
          heading: "2. کون سا نمبر شمار ہوتا ہے",
          body: "آپ کا زمرہ اس نمبر پر مبنی ہے جو زیادہ خطرناک حد میں ہو — مثلاً 135/78 صرف سسٹولک نمبر کی وجہ سے مرحلہ 1 شمار ہوگا۔",
        },
        {
          heading: "3. ٹریکنگ کیوں مفید ہے",
          body: "اس ایپ میں وقت کے ساتھ ریڈنگز ٹریک کرنے سے آپ اور آپ کے ڈاکٹر کو آپ کی معمول کی رینج نظر آتی ہے، بجائے کسی ایک اچانک ریڈنگ پر ردعمل دینے کے۔",
        },
      ],
      spoken:
        "بلڈ پریشر چھ زمروں میں آتا ہے: کم، نارمل، قدرے بلند، مرحلہ 1، مرحلہ 2، یا ہائپرٹینسِو بحران۔ زمرہ اس نمبر پر مبنی ہے جو زیادہ خطرناک ہو۔",
    },
  },

  "Measure BP at Home": {
    en: {
      sections: [
        {
          heading: "1. Before you measure",
          body: "Sit quietly for 5 minutes before measuring. Avoid measuring right after exercise, caffeine, smoking, or a stressful moment — all of these temporarily raise your reading.",
        },
        {
          heading: "2. Correct posture",
          body: "Sit with your back supported, feet flat on the floor (not crossed), and your arm resting at heart level — a table works well for this.",
        },
        {
          heading: "3. During measurement",
          body: "Avoid talking or moving during the reading. Take two readings about a minute apart and use the average, since the first reading is often slightly higher.",
        },
        {
          heading: "4. Building a routine",
          body: "Measure at roughly the same time each day — many people find morning and evening readings most useful for spotting patterns.",
        },
      ],
      spoken:
        "Sit quietly for 5 minutes before measuring. Keep your back supported, feet flat, and your arm at heart level. Avoid talking, and take two readings a minute apart.",
    },
    ur: {
      sections: [
        {
          heading: "1. ناپنے سے پہلے",
          body: "ناپنے سے پہلے 5 منٹ خاموشی سے بیٹھیں۔ ورزش، کیفین، سگریٹ، یا تناؤ کے فوراً بعد نہ ناپیں — یہ سب عارضی طور پر ریڈنگ بڑھا دیتے ہیں۔",
        },
        {
          heading: "2. درست بیٹھنے کا انداز",
          body: "کمر کو سہارا دے کر بیٹھیں، پاؤں زمین پر رکھیں (کراس نہ کریں)، اور بازو دل کی سطح پر رکھیں — میز اس کے لیے مددگار ہوتی ہے۔",
        },
        {
          heading: "3. ناپتے وقت",
          body: "ناپتے وقت بات یا حرکت نہ کریں۔ ایک منٹ کے وقفے سے دو ریڈنگز لے کر اوسط نکالیں، کیونکہ پہلی ریڈنگ اکثر تھوڑی زیادہ ہوتی ہے۔",
        },
        {
          heading: "4. معمول بنائیں",
          body: "روزانہ تقریباً ایک ہی وقت پر ناپیں — بہت سے لوگوں کو صبح اور شام کی ریڈنگز پیٹرن دیکھنے کے لیے سب سے مفید لگتی ہیں۔",
        },
      ],
      spoken:
        "ناپنے سے پہلے 5 منٹ خاموشی سے بیٹھیں۔ کمر کو سہارا دیں، پاؤں زمین پر رکھیں، بازو دل کی سطح پر رکھیں۔ بات نہ کریں اور دو ریڈنگز لے کر اوسط نکالیں۔",
    },
  },

  "Change Lifestyle to Fight Hypotension": {
    en: {
      sections: [
        {
          heading: "1. Fluids and salt",
          body: "Drink more water throughout the day, and if your doctor approves, add a little extra salt — both help raise blood volume and pressure.",
        },
        {
          heading: "2. Move carefully",
          body: "Stand up slowly from sitting or lying down to avoid the dizziness that comes from a sudden pressure drop.",
        },
        {
          heading: "3. Eating habits",
          body: "Eat smaller, more frequent meals rather than large ones — digestion can temporarily divert blood flow and lower pressure further after a big meal.",
        },
        {
          heading: "4. Compression support",
          body: "Compression stockings can help some people by improving blood flow back to the heart, especially if you're on your feet a lot.",
        },
      ],
      spoken:
        "For low blood pressure, drink more water, add a little extra salt if your doctor approves, and stand up slowly to avoid dizziness. Eat smaller, more frequent meals.",
    },
    ur: {
      sections: [
        {
          heading: "1. پانی اور نمک",
          body: "دن بھر زیادہ پانی پئیں، اور اگر ڈاکٹر اجازت دے تو تھوڑا اضافی نمک لیں — دونوں خون کا حجم اور دباؤ بڑھانے میں مدد دیتے ہیں۔",
        },
        {
          heading: "2. احتیاط سے حرکت کریں",
          body: "چکر سے بچنے کے لیے بیٹھنے یا لیٹنے سے آہستہ آہستہ اٹھیں، کیونکہ اچانک اٹھنے سے دباؤ تیزی سے گر سکتا ہے۔",
        },
        {
          heading: "3. کھانے کی عادات",
          body: "بڑے کھانوں کی بجائے چھوٹے اور بار بار کھانے کھائیں — ہاضمہ بڑے کھانے کے بعد خون کا بہاؤ موڑ کر دباؤ مزید کم کر سکتا ہے۔",
        },
        {
          heading: "4. کمپریشن سہارا",
          body: "کمپریشن جرابیں دل کی طرف خون کی روانی بہتر بنا کر مدد دے سکتی ہیں، خاص طور پر اگر آپ زیادہ دیر کھڑے رہتے ہیں۔",
        },
      ],
      spoken:
        "کم بلڈ پریشر کے لیے زیادہ پانی پئیں، اگر ڈاکٹر اجازت دے تو تھوڑا نمک لیں، اور چکر سے بچنے کے لیے آہستہ اٹھیں۔ چھوٹے اور بار بار کھانے کھائیں۔",
    },
  },

  "Know & Treat Gestational Hypertension": {
    en: {
      sections: [
        {
          heading: "1. What it is",
          body: "Gestational hypertension is high blood pressure that develops after 20 weeks of pregnancy in someone with no prior history of high blood pressure.",
        },
        {
          heading: "2. How it differs from preeclampsia",
          body: "Preeclampsia also involves signs like protein in the urine or effects on organs like the liver or kidneys. The two conditions are related and both need careful monitoring.",
        },
        {
          heading: "3. Monitoring and care",
          body: "Regular prenatal check-ups are the main way this is caught and managed. Home readings are a useful supplement, but always report elevated numbers to your OB/GYN promptly rather than waiting for the next appointment.",
        },
      ],
      spoken:
        "Gestational hypertension is high blood pressure developing after 20 weeks of pregnancy. Regular prenatal check-ups are key — always report elevated home readings to your doctor promptly.",
    },
    ur: {
      sections: [
        {
          heading: "1. یہ کیا ہے",
          body: "حمل کے دوران ہائی بلڈ پریشر وہ حالت ہے جو حمل کے 20 ہفتوں کے بعد ایسے شخص میں پیدا ہوتی ہے جسے پہلے ہائی بلڈ پریشر نہ رہا ہو۔",
        },
        {
          heading: "2. پری ایکلیمپسیا سے فرق",
          body: "پری ایکلیمپسیا میں پیشاب میں پروٹین یا جگر و گردوں پر اثرات جیسی علامات بھی شامل ہوتی ہیں۔ دونوں حالتیں آپس میں جڑی ہیں اور احتیاط سے نگرانی درکار ہے۔",
        },
        {
          heading: "3. نگرانی اور دیکھ بھال",
          body: "باقاعدہ حمل کے چیک اپس اس کی تشخیص اور انتظام کا بنیادی ذریعہ ہیں۔ گھر کی ریڈنگز مددگار ہیں، مگر بلند نمبر اگلی اپائنٹمنٹ کا انتظار کیے بغیر فوراً اپنے ڈاکٹر کو بتائیں۔",
        },
      ],
      spoken:
        "حمل کے 20 ہفتوں کے بعد ہائی بلڈ پریشر پیدا ہو سکتا ہے۔ باقاعدہ چیک اپس ضروری ہیں — بلند ریڈنگز فوراً اپنے ڈاکٹر کو بتائیں۔",
    },
  },

  "Avoid 9 Foods for Hypertension": {
    en: {
      sections: [
        {
          heading: "1. Processed and salty foods",
          body: "Canned soups, deli meats, frozen pizza, pickles, canned vegetables (unless labeled low-sodium), soy sauce, fast food, and salted snacks are all high in sodium, which raises blood pressure over time.",
        },
        {
          heading: "2. Sugary drinks",
          body: "Sugary sodas and juices are linked to weight gain and higher blood pressure, partly through their effect on blood vessels and insulin levels.",
        },
        {
          heading: "3. A more useful habit",
          body: "Rather than avoiding entire food categories, reading nutrition labels for sodium content is often more practical — low-sodium versions of many of these foods exist.",
        },
      ],
      spoken:
        "Foods linked to high blood pressure include canned soups, deli meats, frozen pizza, pickles, soy sauce, fast food, salty snacks, and sugary drinks. The common thread is sodium and sugar.",
    },
    ur: {
      sections: [
        {
          heading: "1. پروسیسڈ اور نمکین کھانے",
          body: "ڈبہ بند سوپ، ڈیلی گوشت، فروزن پیزا، اچار، ڈبہ بند سبزیاں (کم سوڈیم کے علاوہ)، سویا ساس، فاسٹ فوڈ، اور نمکین اسنیکس سب میں سوڈیم زیادہ ہوتا ہے جو وقت کے ساتھ بلڈ پریشر بڑھاتا ہے۔",
        },
        {
          heading: "2. میٹھے مشروبات",
          body: "میٹھے سوڈا اور جوس وزن بڑھنے اور بلند بلڈ پریشر سے جڑے ہیں، جزوی طور پر خون کی نالیوں اور انسولین کی سطح پر اثر کی وجہ سے۔",
        },
        {
          heading: "3. زیادہ مفید عادت",
          body: "پوری کھانے کی اقسام سے پرہیز کی بجائے سوڈیم کے لیے نیوٹریشن لیبل پڑھنا زیادہ عملی ہے — ان میں سے کئی کھانوں کے کم سوڈیم ورژن موجود ہیں۔",
        },
      ],
      spoken:
        "بلڈ پریشر بڑھانے والے کھانوں میں ڈبہ بند سوپ، ڈیلی گوشت، اچار، سویا ساس، فاسٹ فوڈ، نمکین اسنیکس اور میٹھے مشروبات شامل ہیں۔ مشترکہ عنصر سوڈیم اور چینی ہے۔",
    },
  },

  "Avoid 5 Foods for Hypotension": {
    en: {
      sections: [
        {
          heading: "1. Alcohol and caffeine",
          body: "Alcohol dehydrates the body and can drop blood pressure further, while excess caffeine can cause a temporary spike followed by a dip.",
        },
        {
          heading: "2. Heavy or hot meals",
          body: "Large starchy meals and very hot soups or drinks (especially in hot weather) can divert blood flow to digestion or skin, lowering blood pressure elsewhere.",
        },
        {
          heading: "3. Skipping meals",
          body: "Going too long without eating can cause blood sugar and blood pressure to drop together, leading to lightheadedness.",
        },
      ],
      spoken:
        "If you have low blood pressure, avoid alcohol, large starchy meals, excess caffeine, very hot drinks in hot weather, and skipping meals.",
    },
    ur: {
      sections: [
        {
          heading: "1. الکحل اور کیفین",
          body: "الکحل جسم کو پانی کی کمی کا شکار کرتا ہے اور بلڈ پریشر مزید کم کر سکتا ہے، جبکہ زیادہ کیفین عارضی اضافے کے بعد کمی کا باعث بن سکتی ہے۔",
        },
        {
          heading: "2. بھاری یا گرم کھانے",
          body: "بڑے نشاستہ دار کھانے اور بہت گرم سوپ یا مشروبات (خاص طور پر گرم موسم میں) خون کا بہاؤ ہاضمے یا جلد کی طرف موڑ سکتے ہیں، جس سے دیگر جگہوں پر بلڈ پریشر کم ہو جاتا ہے۔",
        },
        {
          heading: "3. کھانا چھوڑنا",
          body: "زیادہ دیر تک کچھ نہ کھانے سے بلڈ شوگر اور بلڈ پریشر دونوں ایک ساتھ گر سکتے ہیں، جس سے چکر آ سکتے ہیں۔",
        },
      ],
      spoken:
        "کم بلڈ پریشر میں الکحل، بڑے نشاستہ دار کھانے، زیادہ کیفین، گرم مشروبات اور کھانا چھوڑنے سے پرہیز کریں۔",
    },
  },

  "Control Hypotension via Diet": {
    en: {
      sections: [
        {
          heading: "1. Fluids and salt",
          body: "Increasing fluid intake and modest salt intake — with your doctor's guidance — are the two biggest dietary levers for raising low blood pressure.",
        },
        {
          heading: "2. Meal structure",
          body: "Small, frequent meals rich in complex carbs and protein tend to cause less of a post-meal blood pressure dip than large, simple-carb-heavy meals.",
        },
        {
          heading: "3. Nutrients that matter",
          body: "Vitamin B12 and folate deficiencies can contribute to low blood pressure in some people. Eggs, leafy greens, and fortified cereals can help if that's a factor for you.",
        },
      ],
      spoken:
        "For low blood pressure, increase fluids and modest salt intake with your doctor's guidance. Eat small, frequent meals rich in complex carbs and protein.",
    },
    ur: {
      sections: [
        {
          heading: "1. پانی اور نمک",
          body: "زیادہ پانی اور معتدل نمک (ڈاکٹر کی ہدایت سے) کم بلڈ پریشر بڑھانے کی سب سے اہم غذائی تدابیر ہیں۔",
        },
        {
          heading: "2. کھانے کی ترتیب",
          body: "چھوٹے اور بار بار کھانے جن میں پیچیدہ کاربوہائیڈریٹس اور پروٹین ہوں، بڑے سادہ کاربوہائیڈریٹ والے کھانوں کے مقابلے میں کھانے کے بعد کم بلڈ پریشر نہیں گراتے۔",
        },
        {
          heading: "3. اہم غذائی اجزاء",
          body: "وٹامن B12 اور فولیٹ کی کمی بھی کچھ لوگوں میں کم بلڈ پریشر کی وجہ بن سکتی ہے۔ انڈے، سبز پتوں والی سبزیاں، اور فورٹیفائیڈ اناج مددگار ہو سکتے ہیں۔",
        },
      ],
      spoken:
        "کم بلڈ پریشر کے لیے زیادہ پانی اور معتدل نمک لیں۔ چھوٹے اور بار بار کھانے کھائیں جن میں پروٹین اور پیچیدہ کاربوہائیڈریٹس ہوں۔",
    },
  },

  "Get Tests to Diagnose Hypertension": {
    en: {
      sections: [
        {
          heading: "1. Multiple readings first",
          body: "Diagnosis typically requires multiple elevated readings on different days, not just one — that's why home tracking, like this app, is genuinely valuable to your doctor.",
        },
        {
          heading: "2. Common follow-up tests",
          body: "Your doctor may order a basic metabolic panel, urinalysis, and an ECG to check for related effects on your kidneys, electrolytes, and heart rhythm.",
        },
        {
          heading: "3. Ruling out 'white coat' effect",
          body: "24-hour ambulatory blood pressure monitoring is sometimes used to check whether readings are genuinely elevated, or just higher due to the stress of a clinic visit.",
        },
        {
          heading: "4. Checking underlying causes",
          body: "If hypertension appears suddenly or is hard to control, tests for kidney function, thyroid levels, or hormone imbalances may be done to look for an underlying cause.",
        },
      ],
      spoken:
        "Diagnosis needs multiple elevated readings on different days, not just one. Your doctor may also order blood tests, urinalysis, an ECG, or 24-hour monitoring.",
    },
    ur: {
      sections: [
        {
          heading: "1. پہلے کئی ریڈنگز",
          body: "تشخیص کے لیے عام طور پر مختلف دنوں میں کئی بلند ریڈنگز درکار ہوتی ہیں، صرف ایک نہیں — اسی لیے گھر پر ٹریکنگ (اس ایپ کی طرح) ڈاکٹر کے لیے واقعی مفید ہے۔",
        },
        {
          heading: "2. عام فالو اپ ٹیسٹ",
          body: "آپ کا ڈاکٹر بنیادی میٹابولک پینل، پیشاب کا ٹیسٹ، اور ای سی جی کروا سکتا ہے تاکہ گردوں، الیکٹرولائٹس، اور دل کی دھڑکن پر اثرات چیک کیے جا سکیں۔",
        },
        {
          heading: "3. 'وائٹ کوٹ' اثر کا رد",
          body: "24 گھنٹے کی بلڈ پریشر مانیٹرنگ کبھی کبھار یہ چیک کرنے کے لیے استعمال ہوتی ہے کہ آیا ریڈنگز واقعی بلند ہیں یا صرف کلینک کے تناؤ کی وجہ سے۔",
        },
        {
          heading: "4. بنیادی وجوہات کی جانچ",
          body: "اگر ہائی بلڈ پریشر اچانک ظاہر ہو یا قابو میں نہ آئے تو گردے، تھائیرائیڈ، یا ہارمونز کے ٹیسٹ بنیادی وجہ تلاش کرنے کے لیے کیے جا سکتے ہیں۔",
        },
      ],
      spoken:
        "تشخیص کے لیے مختلف دنوں میں کئی بلند ریڈنگز درکار ہوتی ہیں۔ ڈاکٹر بلڈ ٹیسٹ، پیشاب کا ٹیسٹ، ای سی جی، یا 24 گھنٹے کی مانیٹرنگ بھی کروا سکتا ہے۔",
    },
  },
};

export const INFO_DISCLAIMER = {
  en: "This is general educational information, not personalized medical advice. Always talk with a doctor or clinician about your specific situation.",
  ur: "یہ عمومی تعلیمی معلومات ہیں، ذاتی طبی مشورہ نہیں۔ اپنی مخصوص صورتحال کے بارے میں ہمیشہ ڈاکٹر سے بات کریں۔",
};
