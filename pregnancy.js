// Pregnancy Tracking JavaScript

// Pregnancy data stored in localStorage
let pregnancyData = JSON.parse(localStorage.getItem('pregnancyData')) || {
    lmpDate: null,
    edd: null,
    conceptionDate: null,
    journalEntries: [],
    symptoms: [],
    weightLog: []
};

// Pregnancy week data with daily updates
const pregnancyWeeks = {
    1: {
        babySize: "Size of a poppy seed",
        babyDevelopment: "Fertilization occurs! The egg and sperm unite to form a zygote, which begins dividing rapidly.",
        motherBody: "You may not notice any changes yet, but your body is already preparing for pregnancy. Hormone levels are beginning to shift.",
        milestones: ["Fertilization occurs", "Cell division begins", "Implantation preparation starts"],
        bodyChanges: ["Hormonal changes begin", "No visible symptoms yet"]
    },
    2: {
        babySize: "Size of a sesame seed",
        babyDevelopment: "The fertilized egg implants into the uterine wall. The placenta begins to form.",
        motherBody: "Some women may experience light spotting during implantation. Your body is producing hCG hormone.",
        milestones: ["Implantation occurs", "Placenta formation begins", "Amniotic sac starts forming"],
        bodyChanges: ["Possible implantation spotting", "hCG hormone production begins"]
    },
    3: {
        babySize: "Size of a lentil",
        babyDevelopment: "The neural tube is forming, which will become your baby's brain and spinal cord. The heart begins to beat!",
        motherBody: "You might start feeling early pregnancy symptoms like fatigue, tender breasts, or morning sickness.",
        milestones: ["Neural tube forms", "Heart begins beating", "Basic body structure starts"],
        bodyChanges: ["Early pregnancy symptoms may appear", "Increased fatigue possible"]
    },
    4: {
        babySize: "Size of a blueberry",
        babyDevelopment: "Your baby's brain, spinal cord, and heart are developing rapidly. Tiny arm and leg buds are forming.",
        motherBody: "Morning sickness may begin. Your breasts may feel tender and swollen. You might feel more tired than usual.",
        milestones: ["Brain development accelerates", "Arm and leg buds appear", "Heart pumps blood"],
        bodyChanges: ["Morning sickness may start", "Breast tenderness increases", "Fatigue intensifies"]
    },
    5: {
        babySize: "Size of a grain of rice",
        babyDevelopment: "Your baby's face is beginning to form with dark spots for eyes and openings for nostrils and mouth.",
        motherBody: "Hormonal changes continue. You may experience mood swings, food cravings, or aversions.",
        milestones: ["Facial features begin forming", "Eyes and nostrils develop", "Mouth opening forms"],
        bodyChanges: ["Mood swings may occur", "Food cravings or aversions", "Hormonal fluctuations"]
    },
    6: {
        babySize: "Size of a sweet pea",
        babyDevelopment: "Your baby's heart is beating about 100-160 times per minute. Fingers and toes are beginning to form.",
        motherBody: "Morning sickness may peak this week. You might need to urinate more frequently.",
        milestones: ["Heart beats 100-160 bpm", "Fingers and toes forming", "Kidneys begin developing"],
        bodyChanges: ["Morning sickness may peak", "Frequent urination", "Increased sense of smell"]
    },
    7: {
        babySize: "Size of a blueberry",
        babyDevelopment: "Your baby's brain is growing rapidly. The mouth and tongue are developing. Elbows and wrists are visible.",
        motherBody: "Your uterus is expanding. You may notice your waistline starting to thicken slightly.",
        milestones: ["Brain growth accelerates", "Elbows and wrists form", "Mouth and tongue develop"],
        bodyChanges: ["Uterus begins expanding", "Waistline may thicken", "Possible bloating"]
    },
    8: {
        babySize: "Size of a kidney bean",
        babyDevelopment: "Your baby is now called a fetus. All major organs are beginning to form. The tail is disappearing.",
        motherBody: "You may experience increased fatigue. Your body is working hard to support your growing baby.",
        milestones: ["All major organs forming", "Tail disappears", "Now called a fetus"],
        bodyChanges: ["Increased fatigue", "Body working harder", "Possible constipation"]
    },
    9: {
        babySize: "Size of a grape",
        babyDevelopment: "Your baby's head is large compared to the body. Eyelids are forming and will cover the eyes soon.",
        motherBody: "Your breasts continue to grow. You may notice your clothes feeling tighter around the waist.",
        milestones: ["Eyelids forming", "Head proportionally large", "Muscle development begins"],
        bodyChanges: ["Breasts continue growing", "Clothes may feel tighter", "Possible heartburn"]
    },
    10: {
        babySize: "Size of a kumquat",
        babyDevelopment: "Your baby's vital organs are fully formed and beginning to function. The baby can move, though you can't feel it yet.",
        motherBody: "You're nearing the end of the first trimester. Morning sickness may start to improve.",
        milestones: ["Vital organs functioning", "Baby can move", "Bones begin hardening"],
        bodyChanges: ["Morning sickness may improve", "Energy may return", "End of first trimester approaching"]
    },
    11: {
        babySize: "Size of a fig",
        babyDevelopment: "Your baby's fingers and toes are no longer webbed. The baby is becoming more active, moving arms and legs.",
        motherBody: "Your uterus is now about the size of a grapefruit. You may start showing a small bump.",
        milestones: ["Fingers and toes separate", "Increased movement", "Genitals developing"],
        bodyChanges: ["Uterus size of grapefruit", "Small bump may appear", "Hair and nails may grow faster"]
    },
    12: {
        babySize: "Size of a lime",
        babyDevelopment: "Your baby's reflexes are developing. The baby can make a fist, curl toes, and move facial muscles.",
        motherBody: "Congratulations! You've completed the first trimester. Risk of miscarriage significantly decreases.",
        milestones: ["Reflexes developing", "Can make a fist", "Facial muscles working"],
        bodyChanges: ["First trimester complete!", "Miscarriage risk decreases", "Energy levels improving"]
    },
    13: {
        babySize: "Size of a peach",
        babyDevelopment: "Your baby's vocal cords are developing. The baby can swallow and make sucking motions.",
        motherBody: "You're entering the second trimester - often called the 'honeymoon period' of pregnancy.",
        milestones: ["Vocal cords developing", "Can swallow", "Sucking motions begin"],
        bodyChanges: ["Second trimester begins", "Often feel best now", "Bump becoming more visible"]
    },
    14: {
        babySize: "Size of a lemon",
        babyDevelopment: "Your baby's kidneys are producing urine. Fine hair called lanugo is covering the baby's body.",
        motherBody: "Your energy should be returning. Morning sickness typically subsides by now.",
        milestones: ["Kidneys produce urine", "Lanugo hair appears", "Thyroid gland functioning"],
        bodyChanges: ["Energy returns", "Morning sickness subsides", "Appetite increases"]
    },
    15: {
        babySize: "Size of an apple",
        babyDevelopment: "Your baby can sense light through closed eyelids. The baby's bones are getting harder.",
        motherBody: "You may start feeling your baby move (quickening), though it may feel like gas bubbles at first.",
        milestones: ["Can sense light", "Bones hardening", "Movement increases"],
        bodyChanges: ["May feel baby move", "Appetite increases", "Skin changes possible"]
    },
    16: {
        babySize: "Size of an avocado",
        babyDevelopment: "Your baby's heart is pumping about 25 quarts of blood per day. The baby can hear sounds.",
        motherBody: "Your bump is becoming more noticeable. You may experience round ligament pain as your uterus grows.",
        milestones: ["Heart pumps 25 quarts/day", "Can hear sounds", "Taste buds developing"],
        bodyChanges: ["Bump more noticeable", "Round ligament pain possible", "Glowing skin"]
    },
    17: {
        babySize: "Size of a turnip",
        babyDevelopment: "Your baby is developing fat stores. The skeleton is changing from soft cartilage to bone.",
        motherBody: "You may experience backaches as your center of gravity shifts. Your appetite continues to increase.",
        milestones: ["Fat stores developing", "Skeleton ossifying", "Umbilical cord strong"],
        bodyChanges: ["Backaches may occur", "Center of gravity shifts", "Appetite increases"]
    },
    18: {
        babySize: "Size of a bell pepper",
        babyDevelopment: "Your baby's nervous system is maturing. The baby can yawn, hiccup, and make facial expressions.",
        motherBody: "You might feel your baby's movements more clearly now. Your uterus is about the size of a cantaloupe.",
        milestones: ["Nervous system maturing", "Can yawn and hiccup", "Facial expressions"],
        bodyChanges: ["Baby movements clearer", "Uterus size of cantaloupe", "Possible stretch marks"]
    },
    19: {
        babySize: "Size of a mango",
        babyDevelopment: "Your baby's senses are developing. The baby can hear your voice and heartbeat.",
        motherBody: "You may experience leg cramps. Your growing belly may cause some discomfort when sleeping.",
        milestones: ["Senses developing", "Can hear your voice", "Vernix coating forms"],
        bodyChanges: ["Leg cramps possible", "Sleep discomfort", "Belly button may pop"]
    },
    20: {
        babySize: "Size of a banana",
        babyDevelopment: "Congratulations! You're halfway there! Your baby is swallowing and practicing breathing movements.",
        motherBody: "Your baby bump is prominent now. You may feel more movement. Your belly button may have popped out.",
        milestones: ["Halfway point!", "Practicing breathing", "Swallowing regularly"],
        bodyChanges: ["Bump prominent", "More movement felt", "Belly button may pop"]
    },
    21: {
        babySize: "Size of a carrot",
        babyDevelopment: "Your baby's taste buds are working. The baby can taste what you eat through the amniotic fluid.",
        motherBody: "You may experience Braxton Hicks contractions (practice contractions). They're usually painless.",
        milestones: ["Taste buds working", "Can taste your food", "Rapid brain development"],
        bodyChanges: ["Braxton Hicks possible", "Increased movement", "Possible shortness of breath"]
    },
    22: {
        babySize: "Size of a papaya",
        babyDevelopment: "Your baby's sense of touch is developing. The baby can feel when you touch your belly.",
        motherBody: "Your growing uterus may cause some discomfort. You might notice more stretch marks.",
        milestones: ["Sense of touch develops", "Can feel your touch", "Hair on head growing"],
        bodyChanges: ["Uterus discomfort", "More stretch marks", "Possible varicose veins"]
    },
    23: {
        babySize: "Size of a grapefruit",
        babyDevelopment: "Your baby's hearing is fully developed. The baby can recognize your voice and respond to sounds.",
        motherBody: "You may experience swelling in your feet and ankles. Rest and elevate your feet when possible.",
        milestones: ["Hearing fully developed", "Recognizes your voice", "Responds to sounds"],
        bodyChanges: ["Swelling in feet/ankles", "Back pain may increase", "Sleep may be difficult"]
    },
    24: {
        babySize: "Size of an ear of corn",
        babyDevelopment: "Your baby's lungs are developing surfactant, which helps with breathing after birth.",
        motherBody: "You're entering the third trimester soon. Your baby is getting bigger and movements are stronger.",
        milestones: ["Lungs developing surfactant", "Rapid weight gain", "Eyes can open"],
        bodyChanges: ["Third trimester approaching", "Stronger movements", "Possible heartburn"]
    },
    25: {
        babySize: "Size of a rutabaga",
        babyDevelopment: "Your baby's hands are fully developed with fingerprints. The baby is practicing breathing.",
        motherBody: "You may experience more frequent urination as the baby presses on your bladder.",
        milestones: ["Fingerprints formed", "Hands fully developed", "Practicing breathing"],
        bodyChanges: ["Frequent urination", "Baby pressing bladder", "Possible rib pain"]
    },
    26: {
        babySize: "Size of a scallion",
        babyDevelopment: "Your baby's eyes can open and close. The baby responds to light and sound from outside.",
        motherBody: "Your growing belly may make it harder to find a comfortable sleeping position.",
        milestones: ["Eyes can open/close", "Responds to light", "Responds to sound"],
        bodyChanges: ["Sleeping difficulties", "Growing belly", "Possible sciatica"]
    },
    27: {
        babySize: "Size of a head of cauliflower",
        babyDevelopment: "Your baby's brain is growing rapidly. The baby can dream and has sleep-wake cycles.",
        motherBody: "You're in the third trimester! You may feel more tired as your body works harder.",
        milestones: ["Brain growing rapidly", "Can dream", "Sleep-wake cycles"],
        bodyChanges: ["Third trimester begins!", "More tired", "Possible shortness of breath"]
    },
    28: {
        babySize: "Size of an eggplant",
        babyDevelopment: "Your baby can blink and has eyelashes. The baby is gaining weight rapidly.",
        motherBody: "You may start experiencing more Braxton Hicks contractions. Your baby is very active.",
        milestones: ["Can blink", "Eyelashes present", "Rapid weight gain"],
        bodyChanges: ["More Braxton Hicks", "Very active baby", "Possible nesting instinct"]
    },
    29: {
        babySize: "Size of a butternut squash",
        babyDevelopment: "Your baby's bones are fully developed but still soft. The baby is storing iron and calcium.",
        motherBody: "You may experience more back pain. Your growing belly makes daily activities more challenging.",
        milestones: ["Bones fully developed", "Storing iron/calcium", "Immune system developing"],
        bodyChanges: ["More back pain", "Daily activities harder", "Possible hemorrhoids"]
    },
    30: {
        babySize: "Size of a cabbage",
        babyDevelopment: "Your baby can distinguish between light and dark. The baby's brain is developing rapidly.",
        motherBody: "You may feel more uncomfortable as your baby grows. Rest when you can.",
        milestones: ["Distinguishes light/dark", "Brain developing rapidly", "Can regulate temperature"],
        bodyChanges: ["More uncomfortable", "Need more rest", "Possible swelling"]
    },
    31: {
        babySize: "Size of a coconut",
        babyDevelopment: "Your baby is practicing breathing movements. The baby can turn head from side to side.",
        motherBody: "You may experience more frequent Braxton Hicks. Your baby is running out of room to move.",
        milestones: ["Practicing breathing", "Can turn head", "Nervous system maturing"],
        bodyChanges: ["More Braxton Hicks", "Less room for baby", "Possible insomnia"]
    },
    32: {
        babySize: "Size of a jicama",
        babyDevelopment: "Your baby's skin is becoming less wrinkled as fat accumulates. The baby is gaining about half a pound per week.",
        motherBody: "You may feel more tired. Your baby is getting bigger and movements may feel different.",
        milestones: ["Fat accumulating", "Skin less wrinkled", "Gaining 0.5 lb/week"],
        bodyChanges: ["More tired", "Movements feel different", "Possible pelvic pressure"]
    },
    33: {
        babySize: "Size of a pineapple",
        babyDevelopment: "Your baby's bones are hardening, except for the skull which stays soft for delivery.",
        motherBody: "You may experience more frequent urination. Your baby is preparing for birth.",
        milestones: ["Bones hardening", "Skull stays soft", "Immune system strengthening"],
        bodyChanges: ["Frequent urination", "Baby preparing for birth", "Possible false labor"]
    },
    34: {
        babySize: "Size of a cantaloupe",
        babyDevelopment: "Your baby's central nervous system is maturing. The baby's lungs are almost fully developed.",
        motherBody: "You're getting close! You may feel more anxious or excited. Rest is important.",
        milestones: ["CNS maturing", "Lungs almost ready", "Weight gain continues"],
        bodyChanges: ["Getting close!", "More anxious/excited", "Important to rest"]
    },
    35: {
        babySize: "Size of a honeydew melon",
        babyDevelopment: "Your baby's kidneys are fully developed. The baby is gaining weight and getting ready for birth.",
        motherBody: "You may feel more uncomfortable. Your baby is in position for birth (usually head down).",
        milestones: ["Kidneys fully developed", "Gaining weight", "Getting ready for birth"],
        bodyChanges: ["More uncomfortable", "Baby in position", "Possible nesting"]
    },
    36: {
        babySize: "Size of a romaine lettuce",
        babyDevelopment: "Your baby is considered full-term! The baby's lungs are ready for breathing outside the womb.",
        motherBody: "You're full-term! Your baby could come any time now. Watch for signs of labor.",
        milestones: ["Full-term!", "Lungs ready", "Ready for birth"],
        bodyChanges: ["Full-term!", "Could come anytime", "Watch for labor signs"]
    },
    37: {
        babySize: "Size of a Swiss chard",
        babyDevelopment: "Your baby is practicing breathing and sucking. The baby is ready to be born!",
        motherBody: "You're in the home stretch! Your baby is ready. Watch for labor signs like contractions.",
        milestones: ["Practicing breathing", "Practicing sucking", "Ready to be born"],
        bodyChanges: ["Home stretch!", "Watch for labor", "Possible nesting"]
    },
    38: {
        babySize: "Size of a leek",
        babyDevelopment: "Your baby's brain is still developing. The baby is gaining about an ounce per day.",
        motherBody: "You may feel more anxious. Your body is preparing for labor. Rest as much as possible.",
        milestones: ["Brain still developing", "Gaining 1 oz/day", "Fully developed"],
        bodyChanges: ["More anxious", "Body preparing for labor", "Rest important"]
    },
    39: {
        babySize: "Size of a mini watermelon",
        babyDevelopment: "Your baby is fully developed and ready to meet you! The baby is just gaining a bit more weight.",
        motherBody: "You're so close! Your baby could arrive any day. Pay attention to your body's signals.",
        milestones: ["Fully developed", "Just gaining weight", "Ready to meet you"],
        bodyChanges: ["So close!", "Could arrive any day", "Pay attention to signals"]
    },
    40: {
        babySize: "Size of a small pumpkin",
        babyDevelopment: "Your baby is ready! The baby has all the skills needed for life outside the womb.",
        motherBody: "Your due date is here! Your baby will come when ready. Stay calm and trust your body.",
        milestones: ["Ready!", "All skills developed", "Ready for life outside"],
        bodyChanges: ["Due date here!", "Baby will come when ready", "Stay calm"]
    }
};

// Daily tips for mother and baby
const dailyTips = {
    mother: [
        "Stay hydrated - aim for 8-10 glasses of water daily to support increased blood volume",
        "Eat small, frequent meals to help with nausea and maintain steady blood sugar",
        "Take your prenatal vitamins daily - they're crucial for your baby's development",
        "Get plenty of rest - your body is working hard to grow your baby",
        "Practice gentle exercise like walking or prenatal yoga to boost energy and mood",
        "Avoid raw fish, unpasteurized dairy, and deli meats to prevent foodborne illness",
        "Limit caffeine to 200mg per day (about one 12oz coffee)",
        "Wear comfortable, supportive shoes to help with balance and reduce foot pain",
        "Sleep on your left side to improve circulation to your baby",
        "Take time for self-care - warm baths, meditation, or reading can help reduce stress",
        "Eat iron-rich foods like spinach, lean meats, and beans to prevent anemia",
        "Practice good posture to reduce back pain as your belly grows",
        "Wear a supportive bra to help with breast tenderness and growth",
        "Avoid hot tubs and saunas - high temperatures can be harmful to your baby",
        "Get regular dental checkups - pregnancy can affect your oral health",
        "Practice Kegel exercises to strengthen pelvic floor muscles",
        "Eat foods rich in folic acid like leafy greens and fortified cereals",
        "Avoid standing for long periods to reduce swelling and back pain",
        "Take breaks throughout the day to rest and elevate your feet",
        "Listen to your body - if something doesn't feel right, contact your healthcare provider"
    ],
    baby: [
        "Your baby needs folic acid for neural tube development - take your prenatal vitamins",
        "Omega-3 fatty acids support your baby's brain development - eat fish (low mercury) or supplements",
        "Calcium is essential for your baby's bone development - include dairy or fortified alternatives",
        "Protein is crucial for your baby's growth - aim for 70-100g daily",
        "Iron helps prevent anemia and supports your baby's development",
        "Vitamin D supports your baby's bone health - get some safe sun exposure",
        "Avoid alcohol completely - it can cause serious birth defects",
        "Don't smoke - it increases risk of premature birth and low birth weight",
        "Limit exposure to harmful chemicals and toxins in cleaning products",
        "Your baby can hear your voice - talk, sing, or read to your baby daily",
        "Gentle music can stimulate your baby's developing brain",
        "Your baby responds to light - try shining a flashlight on your belly",
        "Stress management helps your baby - practice relaxation techniques",
        "Regular prenatal care ensures your baby's healthy development",
        "Your baby needs consistent nutrition - don't skip meals",
        "Adequate sleep helps your baby grow - prioritize rest",
        "Your baby's brain develops rapidly - eat brain-boosting foods like eggs and nuts",
        "Stay active - gentle exercise promotes healthy blood flow to your baby",
        "Your baby can taste what you eat - enjoy a varied, healthy diet",
        "Positive emotions benefit your baby - surround yourself with support and joy"
    ]
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializePregnancyTracker();
    setupEventListeners();
    updateDailyContent();
    updateReminders();
    updateHealthChecks();
    loadJournalEntries();
});

// Initialize pregnancy tracker
function initializePregnancyTracker() {
    // Set today's date
    const today = new Date();
    document.getElementById('todayDate').textContent = today.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    // Load or calculate EDD
    if (pregnancyData.lmpDate) {
        calculateEDD();
        updateProgress();
    } else {
        // Show modal to set EDD
        setTimeout(() => openModal('eddModal'), 500);
    }
}

// Calculate EDD from LMP
function calculateEDD() {
    if (pregnancyData.lmpDate) {
        const lmp = new Date(pregnancyData.lmpDate);
        const edd = new Date(lmp);
        edd.setDate(edd.getDate() + 280); // 40 weeks = 280 days
        pregnancyData.edd = edd.toISOString().split('T')[0];
        savePregnancyData();
    }
}

// Update progress
function updateProgress() {
    if (!pregnancyData.lmpDate) return;

    const today = new Date();
    const lmp = new Date(pregnancyData.lmpDate);
    const edd = new Date(pregnancyData.edd);
    
    // Calculate days since LMP
    const daysSinceLMP = Math.floor((today - lmp) / (1000 * 60 * 60 * 24));
    const week = Math.floor(daysSinceLMP / 7);
    const day = daysSinceLMP % 7;
    
    // Calculate trimester
    let trimester = '1st';
    if (week >= 13 && week < 27) trimester = '2nd';
    else if (week >= 27) trimester = '3rd';
    
    // Calculate progress percentage
    const totalDays = Math.floor((edd - lmp) / (1000 * 60 * 60 * 24));
    const progress = Math.min(100, Math.max(0, (daysSinceLMP / totalDays) * 100));
    
    // Update UI
    document.getElementById('currentWeek').textContent = week;
    document.getElementById('currentDay').textContent = day;
    document.getElementById('currentTrimester').textContent = trimester;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = `${Math.round(progress)}% Complete`;
    
    // Update EDD display
    if (pregnancyData.edd) {
        const eddDate = new Date(pregnancyData.edd);
        document.getElementById('eddDate').textContent = eddDate.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
        });
        
        const daysRemaining = Math.ceil((eddDate - today) / (1000 * 60 * 60 * 24));
        if (daysRemaining > 0) {
            document.getElementById('daysRemaining').textContent = `${daysRemaining} days remaining`;
        } else if (daysRemaining === 0) {
            document.getElementById('daysRemaining').textContent = 'Due date is today!';
        } else {
            document.getElementById('daysRemaining').textContent = `${Math.abs(daysRemaining)} days overdue`;
        }
    }
    
    // Update week display
    document.getElementById('displayWeek').textContent = week;
    
    return { week, day, trimester };
}

// Update daily content
function updateDailyContent() {
    const progress = updateProgress();
    if (!progress) return;
    
    const week = progress.week;
    const weekData = pregnancyWeeks[week] || pregnancyWeeks[40];
    
    // Update baby development
    document.getElementById('babySize').textContent = weekData.babySize;
    document.getElementById('babyDevelopment').innerHTML = `<p>${weekData.babyDevelopment}</p>`;
    
    const milestonesList = document.getElementById('babyMilestones');
    milestonesList.innerHTML = weekData.milestones.map(m => `<li>${m}</li>`).join('');
    
    // Update mother's body
    document.getElementById('motherBody').innerHTML = `<p>${weekData.motherBody}</p>`;
    
    const bodyChangesList = document.getElementById('bodyChanges');
    bodyChangesList.innerHTML = weekData.bodyChanges.map(c => `<li>${c}</li>`).join('');
    
    // Update week overview
    const weekOverview = document.querySelector('.week-overview');
    weekOverview.innerHTML = `
        <h4>Week ${week} Overview</h4>
        <p><strong>Baby:</strong> ${weekData.babyDevelopment}</p>
        <p><strong>Your Body:</strong> ${weekData.motherBody}</p>
    `;
}

// Update daily tips
function updateDailyTips() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    
    // Get tips based on day of year (rotates through tips)
    const motherTipIndex = dayOfYear % dailyTips.mother.length;
    const babyTipIndex = dayOfYear % dailyTips.baby.length;
    
    // Get 3-4 tips for each
    const motherTipsList = document.getElementById('motherTips');
    const babyTipsList = document.getElementById('babyTips');
    
    let motherTipsHTML = '';
    let babyTipsHTML = '';
    
    for (let i = 0; i < 4; i++) {
        const mIndex = (motherTipIndex + i) % dailyTips.mother.length;
        const bIndex = (babyTipIndex + i) % dailyTips.baby.length;
        
        motherTipsHTML += `
            <li>
                <strong>Tip ${i + 1}</strong>
                <p>${dailyTips.mother[mIndex]}</p>
            </li>
        `;
        
        babyTipsHTML += `
            <li>
                <strong>Tip ${i + 1}</strong>
                <p>${dailyTips.baby[bIndex]}</p>
            </li>
        `;
    }
    
    motherTipsList.innerHTML = motherTipsHTML;
    babyTipsList.innerHTML = babyTipsHTML;
}

// Update reminders
function updateReminders() {
    const progress = updateProgress();
    if (!progress) return;
    
    const week = progress.week;
    const reminders = [];
    
    // Add week-specific reminders
    if (week === 8) {
        reminders.push({
            icon: '🏥',
            title: 'First Prenatal Visit',
            description: 'Schedule your first prenatal appointment if you haven\'t already',
            date: 'This week'
        });
    }
    
    if (week === 12) {
        reminders.push({
            icon: '🔬',
            title: 'First Trimester Screening',
            description: 'Time for your first trimester screening and blood tests',
            date: 'This week'
        });
    }
    
    if (week === 20) {
        reminders.push({
            icon: '👶',
            title: 'Anatomy Scan',
            description: 'Your 20-week anatomy scan to check baby\'s development',
            date: 'This week'
        });
    }
    
    if (week === 28) {
        reminders.push({
            icon: '💉',
            title: 'Glucose Screening',
            description: 'Time for your glucose tolerance test',
            date: 'This week'
        });
    }
    
    // Add general reminders
    reminders.push({
        icon: '💊',
        title: 'Take Prenatal Vitamins',
        description: 'Remember to take your daily prenatal vitamins',
        date: 'Daily'
    });
    
    if (week >= 27) {
        reminders.push({
            icon: '📋',
            title: 'Prepare Birth Plan',
            description: 'Consider creating your birth plan and discussing with your healthcare provider',
            date: 'Soon'
        });
    }
    
    // Display reminders
    const remindersList = document.getElementById('remindersList');
    remindersList.innerHTML = reminders.map(r => `
        <div class="reminder-item">
            <span class="reminder-icon">${r.icon}</span>
            <div class="reminder-content">
                <h4>${r.title}</h4>
                <p>${r.description}</p>
            </div>
            <span class="reminder-date">${r.date}</span>
        </div>
    `).join('');
}

// Update health checks
function updateHealthChecks() {
    const progress = updateProgress();
    if (!progress) return;
    
    const week = progress.week;
    const healthChecks = [];
    
    // Add health checks based on week
    if (week >= 8 && week < 12) {
        healthChecks.push({
            icon: '🩺',
            title: 'First Prenatal Visit',
            description: 'Initial checkup and blood work',
            date: 'Weeks 8-12'
        });
    }
    
    if (week >= 11 && week < 14) {
        healthChecks.push({
            icon: '🔬',
            title: 'First Trimester Screening',
            description: 'Nuchal translucency scan and blood tests',
            date: 'Weeks 11-14'
        });
    }
    
    if (week >= 15 && week < 22) {
        healthChecks.push({
            icon: '👶',
            title: 'Anatomy Scan',
            description: 'Detailed ultrasound of baby\'s development',
            date: 'Weeks 18-22'
        });
    }
    
    if (week >= 24 && week < 28) {
        healthChecks.push({
            icon: '💉',
            title: 'Glucose Screening',
            description: 'Test for gestational diabetes',
            date: 'Weeks 24-28'
        });
    }
    
    if (week >= 35) {
        healthChecks.push({
            icon: '🦠',
            title: 'Group B Strep Test',
            description: 'Screening for bacterial infection',
            date: 'Weeks 35-37'
        });
    }
    
    // Display health checks
    const healthChecksGrid = document.getElementById('healthChecksGrid');
    if (healthChecks.length > 0) {
        healthChecksGrid.innerHTML = healthChecks.map(hc => `
            <div class="health-check-card">
                <div class="health-check-icon">${hc.icon}</div>
                <h4>${hc.title}</h4>
                <p>${hc.description}</p>
                <span class="health-check-date">${hc.date}</span>
            </div>
        `).join('');
    } else {
        healthChecksGrid.innerHTML = '<p style="text-align: center; color: var(--text-medium);">No upcoming health checks at this time.</p>';
    }
}

// Setup event listeners
function setupEventListeners() {
    // EDD modal
    document.getElementById('editEDDBtn').addEventListener('click', () => {
        openModal('eddModal');
        if (pregnancyData.lmpDate) {
            document.getElementById('lmpDate').value = pregnancyData.lmpDate;
        }
    });
    
    // EDD form
    document.getElementById('eddForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const lmpDate = document.getElementById('lmpDate').value;
        if (lmpDate) {
            pregnancyData.lmpDate = lmpDate;
            calculateEDD();
            updateProgress();
            updateDailyContent();
            updateReminders();
            updateHealthChecks();
            closeAllModals();
        }
    });
    
    // Week navigation
    document.getElementById('prevWeekBtn').addEventListener('click', () => {
        const currentWeek = parseInt(document.getElementById('displayWeek').textContent);
        if (currentWeek > 1) {
            document.getElementById('displayWeek').textContent = currentWeek - 1;
            updateWeekDetails(currentWeek - 1);
        }
    });
    
    document.getElementById('nextWeekBtn').addEventListener('click', () => {
        const currentWeek = parseInt(document.getElementById('displayWeek').textContent);
        if (currentWeek < 40) {
            document.getElementById('displayWeek').textContent = currentWeek + 1;
            updateWeekDetails(currentWeek + 1);
        }
    });
    
    // Journal
    document.getElementById('addJournalEntryBtn').addEventListener('click', () => {
        openModal('journalModal');
        document.getElementById('journalDate').valueAsDate = new Date();
    });
    
    document.getElementById('journalForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addJournalEntry();
    });
    
    // Symptom logging
    document.getElementById('logSymptomBtn').addEventListener('click', () => {
        openModal('symptomModal');
        document.getElementById('symptomDate').valueAsDate = new Date();
    });
    
    document.getElementById('symptomForm').addEventListener('submit', (e) => {
        e.preventDefault();
        logSymptom();
    });
    
    // Close modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
}

// Update week details
function updateWeekDetails(week) {
    const weekData = pregnancyWeeks[week] || pregnancyWeeks[40];
    const weekOverview = document.querySelector('.week-overview');
    weekOverview.innerHTML = `
        <h4>Week ${week} Overview</h4>
        <p><strong>Baby Size:</strong> ${weekData.babySize}</p>
        <p><strong>Baby Development:</strong> ${weekData.babyDevelopment}</p>
        <p><strong>Your Body:</strong> ${weekData.motherBody}</p>
        <h5 style="margin-top: 20px;">Key Milestones:</h5>
        <ul style="margin-left: 20px; margin-top: 10px;">
            ${weekData.milestones.map(m => `<li>${m}</li>`).join('')}
        </ul>
    `;
}

// Add journal entry
function addJournalEntry() {
    const entry = {
        date: document.getElementById('journalDate').value,
        title: document.getElementById('journalTitle').value,
        content: document.getElementById('journalEntry').value,
        photo: null // Handle photo upload separately if needed
    };
    
    if (!pregnancyData.journalEntries) {
        pregnancyData.journalEntries = [];
    }
    
    pregnancyData.journalEntries.unshift(entry); // Add to beginning
    savePregnancyData();
    loadJournalEntries();
    closeAllModals();
    
    // Reset form
    document.getElementById('journalForm').reset();
}

// Load journal entries
function loadJournalEntries() {
    const journalEntries = document.getElementById('journalEntries');
    
    if (!pregnancyData.journalEntries || pregnancyData.journalEntries.length === 0) {
        journalEntries.innerHTML = '<p style="text-align: center; color: var(--text-medium); padding: 40px;">No journal entries yet. Click "Add Entry" to start documenting your journey!</p>';
        return;
    }
    
    journalEntries.innerHTML = pregnancyData.journalEntries.map(entry => `
        <div class="journal-entry">
            <div class="journal-entry-header">
                <h4 class="journal-entry-title">${entry.title}</h4>
                <span class="journal-entry-date">${new Date(entry.date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                })}</span>
            </div>
            <div class="journal-entry-content">${entry.content}</div>
            ${entry.photo ? `<img src="${entry.photo}" alt="Journal photo" class="journal-entry-photo">` : ''}
        </div>
    `).join('');
}

// Log symptom
function logSymptom() {
    const symptom = {
        date: document.getElementById('symptomDate').value,
        type: document.getElementById('symptomType').value,
        severity: document.getElementById('symptomSeverity').value
    };
    
    if (!pregnancyData.symptoms) {
        pregnancyData.symptoms = [];
    }
    
    pregnancyData.symptoms.push(symptom);
    savePregnancyData();
    closeAllModals();
    
    alert('Symptom logged successfully!');
    document.getElementById('symptomForm').reset();
}

// Open modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Close all modals
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Save pregnancy data
function savePregnancyData() {
    localStorage.setItem('pregnancyData', JSON.stringify(pregnancyData));
}

// Call update daily tips
setTimeout(updateDailyTips, 100);


