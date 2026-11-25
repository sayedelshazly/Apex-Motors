import { createContext, useContext, useEffect, useState } from 'react';

/**
 * Full-site language switch: Arabic (RTL, default) <-> English (LTR).
 * `t(key, vars)` reads from STR; car fields use the helpers below.
 */
const STR = {
  // nav
  'nav.motors': { ar: 'موتورز', en: 'MOTORS' },
  'nav.menu': { ar: 'القايمة', en: 'Menu' },
  'nav.close': { ar: 'اقفل', en: 'Close' },
  'nav.open': { ar: 'فتح القائمة', en: 'Open menu' },
  'nav.closeAria': { ar: 'إغلاق القائمة', en: 'Close menu' },
  'nav.go': { ar: 'روح', en: 'Go' },
  'nav.call': { ar: 'اتصل', en: 'Call' },
  'nav.sportOn': { ar: 'شغّل السبورت', en: 'Sport on' },
  'nav.sportOff': { ar: 'اطفي السبورت', en: 'Sport off' },
  // hero
  'hero.eyebrow': { ar: 'معرض السيارات الفاخرة — القاهرة الجديدة', en: 'Luxury Car Showroom — New Cairo' },
  'hero.subA': { ar: 'مش بنبيع عربيات… إحنا بنسلّمك وحش.', en: "We don't sell cars… we hand you a beast." },
  'hero.subB': { ar: 'أندر وأقوى العربيات في مصر، مختارة قطعة قطعة.', en: "Egypt's rarest, most powerful cars — hand-picked, one by one." },
  'hero.cta': { ar: 'اكتشف التشكيلة', en: 'Explore the collection' },
  'hero.go': { ar: 'يلا بينا', en: "Let's go" },
  // spotlight
  'spot.priceFrom': { ar: 'السعر يبدأ من', en: 'Price from' },
  'spot.book': { ar: 'احجز تجربة قيادة', en: 'Book a test drive' },
  'spot.prev': { ar: 'السابق', en: 'Previous' },
  'spot.next': { ar: 'التالي', en: 'Next' },
  'spot.beast': { ar: 'الوحش', en: 'The beast' },
  // collection
  'coll.try': { ar: 'جرّبها بنفسك', en: 'Try it yourself' },
  'coll.close': { ar: 'إغلاق', en: 'Close' },
  'coll.view': { ar: 'شوفها', en: 'View it' },
  // gallery
  'gal.keep': { ar: 'كمّل سكرول', en: 'Keep scrolling' },
  // compare
  'cmp.change': { ar: 'غيّر الوحش', en: 'Change car' },
  'cmp.inDuel': { ar: 'في المواجهة', en: 'In the duel' },
  'cmp.swap': { ar: 'بدّل', en: 'Swap' },
  'nav.hybrid': { ar: 'المهجّن', en: 'HYBRID' },
  'hyb.sub': { ar: 'مختبر الوحوش', en: 'The Beast Lab' },
  'hyb.h': { ar: 'ابنِ وحشك المهجّن', en: 'Build Your Hybrid Beast' },
  'hyb.wm': { ar: 'المهجّن', en: 'HYBRID' },
  'hyb.body': { ar: 'الجسم', en: 'Body' },
  'hyb.engine': { ar: 'الموتور', en: 'Engine' },
  'hyb.spirit': { ar: 'الروح', en: 'Spirit' },
  'hyb.score': { ar: 'قوة الوحش', en: 'Beast Score' },
  'hyb.price': { ar: 'التقدير', en: 'Estimate' },
  'hyb.mix': { ar: 'جسم {body} · موتور {engine} · روح {spirit}', en: '{body} body · {engine} engine · {spirit} spirit' },
  'hyb.spiritLine': { ar: 'روح {spirit} باينة في شخصيته: التسارع اتظبط على مزاجها، والصوت اللي هتسمعه تحت ده صوت موتوره الحقيقي — دوّره.', en: 'The {spirit} spirit shapes its character: the sprint is tuned to its mood, and the voice below is its real engine — start it.' },
  'hyb.shuffle': { ar: 'خلّط عشوائي', en: 'Random Mix' },
  'hyb.wa': { ar: 'اسأل عن وحشك', en: 'Ask About Your Beast' },
  'cmp.hp': { ar: 'القوة', en: 'Power' },
  'cmp.accel': { ar: 'التسارع 0—100', en: '0—100 Sprint' },
  'cmp.top': { ar: 'السرعة القصوى', en: 'Top Speed' },
  'cmp.year': { ar: 'سنة الصنع', en: 'Model Year' },
  'cmp.price': { ar: 'الأوفر سعرًا', en: 'Best Price' },
  'cmp.winner': { ar: 'الفائز', en: 'Winner' },
  'cmp.tie': { ar: 'تعادل كامل — وحشين بنفس القوة 🤝', en: 'Dead tie — two equally matched beasts 🤝' },
  'cmp.waBtn': { ar: 'اسأل عن الفائز واتساب', en: 'Ask about the winner' },
  'cmp.waText': { ar: 'عايز أعرف تفاصيل {name} ({price} جنيه) — شفتها كسبت في المقارنة عندكم 🏆', en: 'I want details on the {name} ({price} EGP) — saw it win the duel on your site 🏆' },
  // about
  'about.since': { ar: '١٢ سنة بنجمع الوحوش', en: '12 years collecting beasts' },
  'about.titleA': { ar: 'إحنا مش معرض…', en: "We're not a showroom…" },
  'about.titleB': { ar: 'إحنا', en: "We're a" },
  'about.titleC': { ar: 'نادي أصحاب', en: 'club for people' },
  'about.titleD': { ar: 'الذوق العالي', en: 'with serious taste' },
  'about.body': {
    ar: 'من ٢٠١٢ وإحنا بنسافر العالم ندوّر على العربيات اللي مش بتتلاقى: نسخ محدودة، ألوان نادرة، وعدادات قليلة. كل عربية عندنا ليها حكاية، وشغلنا إن الحكاية دي تكمل معاك.',
    en: 'Since 2012 we have travelled the world hunting the cars you simply cannot find: limited editions, rare colours, low mileage. Every car here has a story — our job is making sure it continues with you.',
  },
  'about.imgAlt': { ar: 'صالة عرض الشاذلي موتورز', en: 'Elshazly Motors showroom' },
  'about.cursor': { ar: 'المعرض', en: 'The showroom' },
  // test drive
  'td.branch': { ar: 'الفرع', en: 'Branch' },
  'td.car': { ar: 'العربية', en: 'The car' },
  'td.day': { ar: 'اليوم', en: 'Day' },
  'td.time': { ar: 'الساعة', en: 'Time' },
  'td.namePh': { ar: 'اسمك', en: 'Your name' },
  'td.phonePh': { ar: 'رقم الموبايل', en: 'Mobile number' },
  'td.summary': { ar: 'الملخص', en: 'Summary' },
  'td.confirm': { ar: 'أكّد الحجز', en: 'Confirm booking' },
  'td.send': { ar: 'ابعت', en: 'Send' },
  'td.doneTitle': { ar: 'اتحجزت يا وحش', en: 'Booked, beast!' },
  'td.doneBody': { ar: '{car} هتكون جاهزة ليك في فرع {branch}، يوم {day} الساعة {time}. هنكلمك على {phone} للتأكيد قبل المعاد.', en: 'Your {car} will be ready at the {branch} branch, {day} at {time}. We will call {phone} to confirm before your slot.' },
  'td.yourNumber': { ar: 'رقمك', en: 'your number' },
  'td.edit': { ar: 'عدّل الحجز', en: 'Edit booking' },
  // footer
  'ft.titleA': { ar: 'عربيتك الجاية', en: 'Your next car is' },
  'ft.body': { ar: 'عدّي علينا اشرب قهوة، اسمع صوت الموتور بنفسك، والباقي علينا. المعرض مفتوح كل يوم من ١٠ الصبح لـ ١٢ بالليل.', en: 'Drop by for a coffee, hear the engine with your own ears, and leave the rest to us. Open daily, 10 AM to 12 AM.' },
  'ft.book': { ar: 'احجز تجربة قيادة', en: 'Book a test drive' },
  'ft.wa': { ar: 'كلّمنا واتساب', en: 'Chat on WhatsApp' },
  'ft.addr': { ar: 'التسعين الشمالي، القاهرة الجديدة', en: 'North Teseen St., New Cairo' },
  'ft.top': { ar: 'ارجع فوق', en: 'Back to top' },
  'ft.lets': { ar: 'يلا', en: "Let's go" },
  // preloader
  'pre.line': { ar: 'بنجهّز الوحوش… دوسنا بنزين', en: 'Warming up the beasts… foot down' },
  // engine starter
  'eng.listen': { ar: 'اسمع صوت الموتور', en: 'Hear the engine' },
  'eng.listenEv': { ar: 'شغّل الكهربا واسمع', en: 'Power up & listen' },
  'eng.start': { ar: 'دوّر الموتور', en: 'Start engine' },
  'eng.startEv': { ar: 'شغّل الكهربا', en: 'Power on' },
  'eng.cranking': { ar: 'بيدوّر…', en: 'Cranking…' },
  'eng.stop': { ar: 'بطّل', en: 'Kill it' },
  'eng.hold': { ar: 'دوس بنزين — امسك الزرار 🏁', en: 'Hold the throttle 🏁' },
  'eng.holdEv': { ar: 'دوس كهربا — امسك الزرار ⚡', en: 'Hold the power ⚡' },
  'eng.crankMsg': { ar: 'المارش شغال… ثواني ويدور', en: 'Cranking… almost there' },
  'eng.keepMsg': { ar: 'إيوه كده! خليك دايس', en: 'Yes! Keep holding' },
  'eng.readyMsg': { ar: 'جاهزة للانطلاق — الموتور بيلف لحد {k} ألف', en: 'Ready to launch — revving to {k}k' },
  'eng.idleMsg': { ar: 'الموتور داير على السلانسيه — الردلاين عند {k} ألف', en: 'Idling — redline at {k}k' },
  'eng.voiceEv': { ar: 'كهربا بالكامل — همهمة وصفارة موتور كهربائي', en: 'Fully electric — motor hum & whine' },
  'eng.voiceSc': { ar: 'سوبرتشارجر — اسمع الصفير وانت دايس', en: 'Supercharged — hear the whine as you push' },
  'eng.voiceTurbo': { ar: 'تيربو — اسمع الصفارة… ولما تسيب: بستشش 💨', en: 'Turbo — hear it spool… lift off: psssh 💨' },
  'eng.voiceCyl': { ar: '{cyl} سلندر بصوتها المتولّد حسب شخصية الموتور', en: '{cyl} cylinders, voice synthesized from the engine character' },
  'eng.cursorStart': { ar: 'دوّر', en: 'Start' },
  'eng.cursorStop': { ar: 'بطّل', en: 'Stop' },
  'eng.cursorGas': { ar: 'بنزين', en: 'Throttle' },
  // misc
  'top.aria': { ar: 'اطلع لأعلى بسرعة قصوى', en: 'Rocket to the top' },
  'top.cursor': { ar: 'لأعلى 🚀', en: 'To the top 🚀' },
};

const LangCtx = createContext({ lang: 'ar', t: (k) => k, toggle: () => {} });

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('apex-lang') === 'en' ? 'en' : 'ar'; } catch { return 'ar'; }
  });

  useEffect(() => {
    const en = lang === 'en';
    document.documentElement.lang = en ? 'en' : 'ar';
    document.documentElement.dir = en ? 'ltr' : 'rtl';
    document.title = en ? 'ELSHAZLY MOTORS | Luxury Car Showroom' : 'الشاذلي موتورز | ELSHAZLY MOTORS';
    try { localStorage.setItem('apex-lang', lang); } catch { /* private mode */ }
  }, [lang]);

  const t = (key, vars) => {
    let s = STR[key]?.[lang] ?? STR[key]?.ar ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
    return s;
  };
  const toggle = () => setLang((l) => (l === 'ar' ? 'en' : 'ar'));

  return <LangCtx.Provider value={{ lang, setLang, toggle, t }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);

/* car field helpers */
export const carName = (car, lang) => (lang === 'ar' ? `${car.brandAr} ${car.modelAr}` : `${car.brand} ${car.model}`);
export const carDesc = (car, lang) => (lang === 'ar' ? car.desc : car.descEn || car.desc);
export const carTag = (car, lang) => (lang === 'ar' ? car.tag : car.tagEn);
