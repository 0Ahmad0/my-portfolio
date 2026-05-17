export const translations = {
    en: {
        nav: {
            about: "About",
            projects: "Work",
            experience: "Experience",
            education: "Education",
            certificates: "Certificates",
            contact: "Contact",
            dashboard: "Dashboard"
        },
        hero: {
            title: "Software Engineer", //
            name: "Ahmad Alhariri", //
            profileImage: "my-portfolio/images/ahmadalhariri.jpg",
            viewWork: "Explore My Work",
            roles: ["Software Engineer", "Mobile Application Developer", "Flutter Expert", "Problem Solver"] //
        },
        about: {
            title: "Crafting High-Performance Mobile Experiences.",
            description: "Motivated Software Engineer with over four years of experience in mobile application development using Flutter. Skilled in designing, building, and optimizing cross-platform applications.", //
            skills: "Core Skills",
            skillList: [
                "Flutter & Dart", "Java", "C++", "C#", "SQL",
                "RESTful APIs", "Firebase", "Agile Methodologies",
                "CI/CD Pipelines", "System Analysis", "GIT & GitHub"
            ], //[cite: 1]
            yearsExp: "4+ Years Exp.", //[cite: 1]
            projectsDone: "20+ Projects", //[cite: 1]
            happyClients: "15+ Clients"
        },
        projects: {
            title: "Selected Works",
            filterAll: "All",
            filterMobile: "Mobile",
            filterWeb: "Web",
            filterDesign: "Design",
            viewLive: "Live Demo",
            viewGithub: "Source Code",
            list: [
                { name: "Tigre", desc: "Ultimate destination for food enthusiasts and restaurant discovery." }, //[cite: 1]
                { name: "Vivafone", desc: "An app for selling eSIM cards with a seamless user experience." }, //[cite: 1]
                { name: "Enjaz", desc: "Tracking and managing university projects with supervisor support." }, //[cite: 1]
                { name: "Mardod App", desc: "AI-powered app exploring Saudi Arabia through chat." } //[cite: 1]
            ]
        },
        experience: {
            title: "Work Experience",
            items: [
                { role: "Mobile Developer", company: "York British Academy", period: "2023 - Present", desc: "Developed government-level mobile applications using Flutter." }, //[cite: 1]
                { role: "Mobile Developer", company: "Future X", period: "2023 - Present", desc: "Built food delivery and social media management applications." }, //[cite: 1]
                { role: "Mobile Developer", company: "Smart Life", period: "2023", desc: "Restructured and optimized CRM applications." } //[cite: 1]
            ]
        },
        education: {
            title: "Education",
            degree: "Bachelor's of Software Engineering", //[cite: 1]
            university: "Damascus University", //[cite: 1]
            year: "2018 - 2023", //[cite: 1]
            gpa: "Good"
        },
        certificates: {
            title: "Certifications",
            list: [
                "Agile Project Management (HP LIFE)",
                "Fundamentals of Technical Project Management",
                "Volunteer Certificate (RBCs Team)"
            ], //[cite: 1]
            verify: "Verify Credential"
        },
        testimonials: {
            title: "Client Testimonials",
            subtitle: "What my clients say about working with me"
        },
        contact: {
            title: "Let's Talk",
            subtitle: "Open for innovative software projects and mobile application development opportunities.",
            name: "Name",
            email: "Email",
            emailLabel: "Email",
            locationLabel: "Location",
            message: "Message",
            send: "Send Message",
            success: "Message sent!",
            error: "Something went wrong.",
            successDescription: "I'll get back to you soon.",
            namePlaceholder: "John Doe",
            emailPlaceholder: "john@example.com",
            messagePlaceholder: "How can I help you?",
            socialLinks: "Connect on Social",
            downloadCV: "Download CV",
            links: {
                instagram: "https://www.instagram.com/dev.ahm",
                x: "https://x.com/AhmadAl45892861",
                linkedin: "https://www.linkedin.com/in/ahmadhariri",
                telegram: "https://t.me/Ahmad_Alhariri",
                facebook: "https://www.facebook.com/ahmad.alhariri.56027",
                whatsapp: "https://wa.me/+963954872922"
            }
        },
        dashboard: {
            title: "Dashboard",
            login: "Restricted Access",
            email: "Email",
            password: "Password",
            enter: "Enter",
            logout: "Logout",
            projects: "Projects",
            personalInfo: "Personal Info",
            experience: "Experience",
            education: "Education",
            certificates: "Certificates",
            save: "Save Changes",
            addNew: "Add New",
            delete: "Delete",
            edit: "Edit",
            loginDescription: "Enter your email and password to manage your portfolio",
            loginError: "Invalid email or password",
            returnToPortfolio: "Return to Portfolio",
            headerTitle: "Portfolio Dashboard",
            headerSubtitle: "Manage your content",
            viewSite: "View Site",
            stats: {
                projects: "Projects",
                experience: "Experience",
                education: "Education",
                certificates: "Certificates"
            },
            tabs: {
                testimonials: "Testimonials"
            },
            itemCount: {
                one: "item",
                many: "items"
            },
            sections: {
                projects: {
                    title: "Projects",
                    add: "Add Project",
                    emptyTitle: "No projects yet",
                    emptyDescription: "Showcase your work by adding your first project. Include images, links, and a description to impress visitors.",
                    emptyAdd: "Add Your First Project"
                },
                experience: {
                    title: "Experience",
                    add: "Add Experience",
                    emptyTitle: "No experience added",
                    emptyDescription: "Add your work history to show visitors where you've worked and what impact you've made in each role.",
                    emptyAdd: "Add Your First Role"
                },
                education: {
                    title: "Education",
                    add: "Add Education",
                    emptyTitle: "No education entries",
                    emptyDescription: "Add your academic background — degrees, bootcamps, and online courses all count.",
                    emptyAdd: "Add Education"
                },
                certificates: {
                    title: "Certificates",
                    add: "Add Certificate",
                    emptyTitle: "No certificates yet",
                    emptyDescription: "Add professional certificates and credentials to build credibility with visitors.",
                    emptyAdd: "Add Your First Certificate"
                },
                testimonials: {
                    title: "Testimonials",
                    add: "Add Testimonial",
                    emptyTitle: "No testimonials yet",
                    emptyDescription: "Add client testimonials to build trust and showcase your work quality.",
                    emptyAdd: "Add Your First Testimonial"
                }
            },
            actions: {
                cancel: "Cancel",
                confirm: "Confirm",
                saved: "Saved!",
                saveChanges: "Save Changes"
            },
            categories: {
                web: "Web",
                mobile: "Mobile",
                design: "Design"
            },
            links: {
                live: "Live",
                github: "GitHub"
            },
            dialogs: {
                project: {
                    titleAdd: "Add New Project",
                    titleEdit: "Edit Project",
                    description: "Fill in the project details. All changes appear live on your portfolio.",
                    titleEn: "Title (English)",
                    titleAr: "Title (Arabic)",
                    category: "Category",
                    tags: "Tags (comma separated)",
                    images: "Project Images — one URL per line (first = cover)",
                    cover: "Cover",
                    liveUrl: "Live URL",
                    githubUrl: "GitHub URL",
                    descEn: "Description (English)",
                    descAr: "Description (Arabic)",
                    placeholderTitleEn: "My Awesome Project",
                    placeholderTitleAr: "مشروعي الرائع",
                    placeholderTags: "React, TypeScript, Node.js",
                    placeholderImages: "https://images.unsplash.com/photo-xxx?w=800\nhttps://images.unsplash.com/photo-yyy?w=800",
                    placeholderLiveUrl: "https://myapp.com",
                    placeholderGithubUrl: "https://github.com/...",
                    placeholderDescEn: "Describe the project, its impact, and technologies used...",
                    placeholderDescAr: "وصف المشروع..."
                },
                experience: {
                    titleAdd: "Add Experience",
                    titleEdit: "Edit Experience",
                    description: "Add your work history. Shown on the portfolio's Experience section.",
                    company: "Company",
                    period: "Period",
                    roleEn: "Role (English)",
                    roleAr: "Role (Arabic)",
                    descEn: "Description (English)",
                    descAr: "Description (Arabic)",
                    placeholderCompany: "Google, Startup Inc., Freelance",
                    placeholderPeriod: "2022 – Present",
                    placeholderRoleEn: "Senior Frontend Engineer",
                    placeholderRoleAr: "مهندس واجهة أمامية",
                    placeholderDescEn: "Key responsibilities, achievements, and impact...",
                    placeholderDescAr: "المسؤوليات والإنجازات..."
                },
                education: {
                    titleAdd: "Add Education",
                    titleEdit: "Edit Education",
                    description: "Add academic credentials and certifications from universities.",
                    institutionEn: "Institution (English)",
                    institutionAr: "Institution (Arabic)",
                    degreeEn: "Degree (English)",
                    degreeAr: "Degree (Arabic)",
                    fieldEn: "Field of Study (English)",
                    fieldAr: "Field of Study (Arabic)",
                    period: "Period",
                    gpa: "GPA (optional)",
                    descEn: "Description (English)",
                    descAr: "Description (Arabic)",
                    placeholderInstitutionEn: "Stanford University",
                    placeholderInstitutionAr: "جامعة ستانفورد",
                    placeholderDegreeEn: "Bachelor of Science",
                    placeholderDegreeAr: "بكالوريوس العلوم",
                    placeholderFieldEn: "Computer Science",
                    placeholderFieldAr: "علوم الحاسب",
                    placeholderPeriod: "2018 – 2022",
                    placeholderGpa: "3.9 / 4.0",
                    placeholderDescEn: "Highlights, thesis, notable courses...",
                    placeholderDescAr: "أبرز الإنجازات والمواد الدراسية..."
                },
                certificate: {
                    titleAdd: "Add Certificate",
                    titleEdit: "Edit Certificate",
                    description: "Add professional certifications and credentials.",
                    titleEn: "Certificate Title (English)",
                    titleAr: "Certificate Title (Arabic)",
                    issuerEn: "Issuer (English)",
                    issuerAr: "Issuer (Arabic)",
                    year: "Year",
                    credentialUrl: "Credential URL (optional)",
                    badgeColor: "Badge Color",
                    placeholderTitleEn: "AWS Solutions Architect",
                    placeholderTitleAr: "مهندس حلول AWS",
                    placeholderIssuerEn: "Amazon Web Services",
                    placeholderIssuerAr: "أمازون ويب سيرفيسز",
                    placeholderYear: "2024",
                    placeholderCredential: "https://verify.example.com/..."
                },
                testimonial: {
                    titleAdd: "Add Testimonial",
                    titleEdit: "Edit Testimonial",
                    description: "Add client testimonials and feedback.",
                    nameEn: "Client Name (English)",
                    nameAr: "Client Name (Arabic)",
                    roleEn: "Role/Title (English)",
                    roleAr: "Role/Title (Arabic)",
                    textEn: "Testimonial Text (English)",
                    textAr: "Testimonial Text (Arabic)",
                    rating: "Rating (1-5 stars)",
                    imageUrl: "Image URL",
                    placeholderNameEn: "Sarah Johnson",
                    placeholderNameAr: "سارة جونسون",
                    placeholderRoleEn: "CEO, TechStartup Inc",
                    placeholderRoleAr: "الرئيس التنفيذي",
                    placeholderTextEn: "Share what you loved about working together...",
                    placeholderTextAr: "شارك ما أعجبك...",
                    placeholderImageUrl: "https://..."
                },
                personalInfo: {
                    title: "Personal Information",
                    description: "Update your bio, contact details, and social links. Changes save to localStorage.",
                    nameEn: "Name (English)",
                    nameAr: "Name (Arabic)",
                    email: "Email",
                    locationEn: "Location (English)",
                    locationAr: "Location (Arabic)",
                    avatarUrl: "Avatar URL",
                    bioEn: "Bio (English)",
                    bioAr: "Bio (Arabic)",
                    socialLinks: "Social Links",
                    github: "GitHub",
                    linkedin: "LinkedIn",
                    twitter: "Twitter / X",
                    instagram: "Instagram",
                    facebook: "Facebook",
                    telegram: "Telegram",
                    whatsapp: "WhatsApp",
                    floatingSkills: "Floating Skill Icons",
                    floatingSkillsLabel: "Skills to display around avatar (comma-separated, max 6)",
                    floatingSkillsHelp: "Examples: React, Flutter, TypeScript, Node.js, Python, Figma, Next.js, etc.",
                    cvResume: "CV & Resume",
                    cvUrl: "CV Download URL",
                    placeholderAvatar: "https://...",
                    placeholderFloating: "React, Flutter, TypeScript, Node.js, Figma, Next.js",
                    placeholderCv: "https://example.com/cv.pdf",
                    placeholderGithub: "https://github.com/...",
                    placeholderLinkedin: "https://linkedin.com/in/...",
                    placeholderTwitter: "https://twitter.com/...",
                    placeholderInstagram: "https://instagram.com/...",
                    placeholderFacebook: "https://facebook.com/...",
                    placeholderTelegram: "https://t.me/...",
                    placeholderWhatsapp: "https://wa.me/..."
                },
                educationItem: {
                    gpaLabel: "GPA"
                }
            }
        },
        footer: {
            rights: "All rights reserved."
        }
    },
    ar: {
        nav: {
            about: "حول",
            projects: "الأعمال",
            experience: "الخبرات",
            education: "التعليم",
            certificates: "الشهادات",
            contact: "اتصل بي",
            dashboard: "لوحة التحكم"
        },
        hero: {
            title: "مهندس برمجيات", //[cite: 1]
            name: "أحمد الحريري", //[cite: 1]
            profileImage: "my-portfolio/images/ahmadalhariri.jpg",
            viewWork: "استكشف أعمالي",
            roles: ["مهندس برمجيات", "مطور تطبيقات موبايل", "خبير فلاتر", "حل المشكلات"] //[cite: 1]
        },
        about: {
            title: "صناعة تجارب موبايل عالية الأداء.",
            description: "مهندس برمجيات طموح لديه أكثر من أربع سنوات من الخبرة في تطوير تطبيقات الموبايل باستخدام Flutter. ماهر في تصميم وبناء وتحسين التطبيقات.", //[cite: 1]
            skills: "المهارات الأساسية",
            skillList: [
                "Flutter & Dart", "Java", "C++", "C#", "SQL",
                "RESTful APIs", "Firebase", "Agile Methodologies",
                "CI/CD Pipelines", "System Analysis", "GIT & GitHub"
            ], //[cite: 1]
            yearsExp: "أكثر من 4 سنوات خبرة", //[cite: 1]
            projectsDone: "أكثر من 20 مشروع", //[cite: 1]
            happyClients: "أكثر من 15 عميل"
        },
        projects: {
            title: "أعمال مختارة",
            filterAll: "الكل",
            filterMobile: "تطبيقات",
            filterWeb: "ويب",
            filterDesign: "تصميم",
            viewLive: "العرض المباشر",
            viewGithub: "كود المصدر",
            list: [
                { name: "Tigre", desc: "الوجهة النهائية لعشاق الطعام واكتشاف المطاعم." }, //[cite: 1]
                { name: "Vivafone", desc: "تطبيق لبيع بطاقات eSIM مع تجربة مستخدم سلسة." }, //[cite: 1]
                { name: "Enjaz", desc: "تتبع وإدارة المشاريع الجامعية مع دعم المشرفين." }, //[cite: 1]
                { name: "Mardod App", desc: "تطبيق مدعوم بالذكاء الاصطناعي لاستكشاف السعودية عبر الدردشة." } //[cite: 1]
            ]
        },
        experience: {
            title: "الخبرة المهنية",
            items: [
                { role: "مطور موبايل", company: "أكاديمية يورك البريطانية", period: "2023 - الآن", desc: "تطوير تطبيقات موبايل على مستوى حكومي باستخدام Flutter." }, //[cite: 1]
                { role: "مطور موبايل", company: "Future X", period: "2023 - الآن", desc: "بناء تطبيقات توصيل طعام وإدارة وسائل التواصل الاجتماعي." }, //[cite: 1]
                { role: "مطور موبايل", company: "Smart Life", period: "2023", desc: "إعادة هيكلة وتحسين تطبيقات إدارة علاقات العملاء (CRM)." } //[cite: 1]
            ]
        },
        education: {
            title: "التعليم",
            degree: "بكالوريوس في هندسة البرمجيات", //[cite: 1]
            university: "جامعة دمشق", //[cite: 1]
            year: "2018 - 2023", //[cite: 1]
            gpa: "جيد جدا"
        },
        certificates: {
            title: "الشهادات",
            list: [
                "إدارة المشاريع Agile (HP LIFE)",
                "أساسيات إدارة المشاريع التقنية",
                "شهادة تطوع (فريق RBCs)"
            ], //[cite: 1]
            verify: "تحقق من الشهادة"
        },
        testimonials: {
            title: "تقييمات العملاء",
            subtitle: "ماذا يقول عملائي عن العمل معي"
        },
        contact: {
            title: "لنتحدث",
            subtitle: "متاح لمشاريع البرمجيات المبتكرة وفرص تطوير تطبيقات الموبايل.",
            name: "الاسم",
            email: "البريد الإلكتروني",
            emailLabel: "البريد الإلكتروني",
            locationLabel: "الموقع",
            message: "الرسالة",
            send: "إرسال الرسالة",
            success: "تم الإرسال بنجاح!",
            error: "حدث خطأ ما.",
            successDescription: "سأعود إليك قريباً.",
            namePlaceholder: "الاسم الكامل",
            emailPlaceholder: "example@domain.com",
            messagePlaceholder: "كيف يمكنني مساعدتك؟",
            socialLinks: "تابعني على وسائل التواصل",
            downloadCV: "تحميل السيرة الذاتية",
            links: {
                instagram: "https://www.instagram.com/dev.ahm",
                x: "https://x.com/AhmadAl45892861",
                linkedin: "https://www.linkedin.com/in/ahmadhariri",
                telegram: "https://t.me/Ahmad_Alhariri",
                facebook: "https://www.facebook.com/ahmad.alhariri.56027",
                whatsapp: "https://wa.me/+963954872922"
            }
        },
        dashboard: {
            title: "لوحة التحكم",
            login: "دخول مقيد",
            email: "البريد الإلكتروني",
            password: "كلمة المرور",
            enter: "دخول",
            logout: "تسجيل خروج",
            projects: "المشاريع",
            personalInfo: "المعلومات الشخصية",
            experience: "الخبرات",
            education: "التعليم",
            certificates: "الشهادات",
            save: "حفظ التغييرات",
            addNew: "إضافة جديد",
            delete: "حذف",
            edit: "تعديل",
            loginDescription: "أدخل البريد الإلكتروني وكلمة المرور لإدارة ملفك الشخصي",
            loginError: "بيانات الدخول غير صحيحة",
            returnToPortfolio: "العودة إلى الملف",
            headerTitle: "لوحة تحكم الملف",
            headerSubtitle: "إدارة المحتوى",
            viewSite: "عرض الموقع",
            stats: {
                projects: "المشاريع",
                experience: "الخبرات",
                education: "التعليم",
                certificates: "الشهادات"
            },
            tabs: {
                testimonials: "آراء العملاء"
            },
            itemCount: {
                one: "عنصر",
                many: "عناصر"
            },
            sections: {
                projects: {
                    title: "المشاريع",
                    add: "إضافة مشروع",
                    emptyTitle: "لا توجد مشاريع بعد",
                    emptyDescription: "اعرض أعمالك بإضافة أول مشروع مع صور وروابط ووصف جذاب.",
                    emptyAdd: "أضف أول مشروع"
                },
                experience: {
                    title: "الخبرات",
                    add: "إضافة خبرة",
                    emptyTitle: "لا توجد خبرات بعد",
                    emptyDescription: "أضف سجل خبراتك لعرض أماكن عملك وتأثيرك في كل دور.",
                    emptyAdd: "أضف أول دور"
                },
                education: {
                    title: "التعليم",
                    add: "إضافة تعليم",
                    emptyTitle: "لا توجد بيانات تعليمية",
                    emptyDescription: "أضف خلفيتك الأكاديمية — الشهادات والدورات والبرامج كلها مهمة.",
                    emptyAdd: "إضافة تعليم"
                },
                certificates: {
                    title: "الشهادات",
                    add: "إضافة شهادة",
                    emptyTitle: "لا توجد شهادات بعد",
                    emptyDescription: "أضف شهاداتك المهنية لتعزيز المصداقية لدى الزوار.",
                    emptyAdd: "أضف أول شهادة"
                },
                testimonials: {
                    title: "آراء العملاء",
                    add: "إضافة رأي",
                    emptyTitle: "لا توجد آراء بعد",
                    emptyDescription: "أضف آراء العملاء لبناء الثقة وإبراز جودة عملك.",
                    emptyAdd: "أضف أول رأي"
                }
            },
            actions: {
                cancel: "إلغاء",
                confirm: "تأكيد",
                saved: "تم الحفظ!",
                saveChanges: "حفظ التغييرات"
            },
            categories: {
                web: "ويب",
                mobile: "موبايل",
                design: "تصميم"
            },
            links: {
                live: "عرض",
                github: "جيت هاب"
            },
            dialogs: {
                project: {
                    titleAdd: "إضافة مشروع جديد",
                    titleEdit: "تعديل مشروع",
                    description: "املأ تفاصيل المشروع. تظهر جميع التغييرات مباشرة في الموقع.",
                    titleEn: "العنوان (إنجليزي)",
                    titleAr: "العنوان (عربي)",
                    category: "التصنيف",
                    tags: "الوسوم (مفصولة بفواصل)",
                    images: "صور المشروع — رابط لكل سطر (الأول غلاف)",
                    cover: "غلاف",
                    liveUrl: "رابط العرض",
                    githubUrl: "رابط GitHub",
                    descEn: "الوصف (إنجليزي)",
                    descAr: "الوصف (عربي)",
                    placeholderTitleEn: "مشروعي الرائع",
                    placeholderTitleAr: "مشروعي الرائع",
                    placeholderTags: "React, TypeScript, Node.js",
                    placeholderImages: "https://images.unsplash.com/photo-xxx?w=800\nhttps://images.unsplash.com/photo-yyy?w=800",
                    placeholderLiveUrl: "https://myapp.com",
                    placeholderGithubUrl: "https://github.com/...",
                    placeholderDescEn: "وصف المشروع وتأثيره والتقنيات المستخدمة...",
                    placeholderDescAr: "وصف المشروع..."
                },
                experience: {
                    titleAdd: "إضافة خبرة",
                    titleEdit: "تعديل خبرة",
                    description: "أضف خبرتك العملية لتظهر في قسم الخبرات.",
                    company: "الشركة",
                    period: "الفترة",
                    roleEn: "المسمى (إنجليزي)",
                    roleAr: "المسمى (عربي)",
                    descEn: "الوصف (إنجليزي)",
                    descAr: "الوصف (عربي)",
                    placeholderCompany: "Google, Startup Inc., Freelance",
                    placeholderPeriod: "2022 – الآن",
                    placeholderRoleEn: "Senior Frontend Engineer",
                    placeholderRoleAr: "مهندس واجهة أمامية",
                    placeholderDescEn: "المسؤوليات والإنجازات والأثر...",
                    placeholderDescAr: "المسؤوليات والإنجازات..."
                },
                education: {
                    titleAdd: "إضافة تعليم",
                    titleEdit: "تعديل تعليم",
                    description: "أضف المؤهلات الأكاديمية من الجامعات أو الدورات.",
                    institutionEn: "المؤسسة (إنجليزي)",
                    institutionAr: "المؤسسة (عربي)",
                    degreeEn: "الدرجة (إنجليزي)",
                    degreeAr: "الدرجة (عربي)",
                    fieldEn: "التخصص (إنجليزي)",
                    fieldAr: "التخصص (عربي)",
                    period: "الفترة",
                    gpa: "المعدل (اختياري)",
                    descEn: "الوصف (إنجليزي)",
                    descAr: "الوصف (عربي)",
                    placeholderInstitutionEn: "Stanford University",
                    placeholderInstitutionAr: "جامعة ستانفورد",
                    placeholderDegreeEn: "Bachelor of Science",
                    placeholderDegreeAr: "بكالوريوس العلوم",
                    placeholderFieldEn: "Computer Science",
                    placeholderFieldAr: "علوم الحاسب",
                    placeholderPeriod: "2018 – 2022",
                    placeholderGpa: "3.9 / 4.0",
                    placeholderDescEn: "أبرز الإنجازات والمواد الدراسية...",
                    placeholderDescAr: "أبرز الإنجازات والمواد الدراسية..."
                },
                certificate: {
                    titleAdd: "إضافة شهادة",
                    titleEdit: "تعديل شهادة",
                    description: "أضف شهاداتك المهنية والاعتمادات.",
                    titleEn: "عنوان الشهادة (إنجليزي)",
                    titleAr: "عنوان الشهادة (عربي)",
                    issuerEn: "الجهة (إنجليزي)",
                    issuerAr: "الجهة (عربي)",
                    year: "السنة",
                    credentialUrl: "رابط التحقق (اختياري)",
                    badgeColor: "لون الشارة",
                    placeholderTitleEn: "AWS Solutions Architect",
                    placeholderTitleAr: "مهندس حلول AWS",
                    placeholderIssuerEn: "Amazon Web Services",
                    placeholderIssuerAr: "أمازون ويب سيرفيسز",
                    placeholderYear: "2024",
                    placeholderCredential: "https://verify.example.com/..."
                },
                testimonial: {
                    titleAdd: "إضافة رأي",
                    titleEdit: "تعديل رأي",
                    description: "أضف آراء العملاء والتقييمات.",
                    nameEn: "اسم العميل (إنجليزي)",
                    nameAr: "اسم العميل (عربي)",
                    roleEn: "المسمى/الدور (إنجليزي)",
                    roleAr: "المسمى/الدور (عربي)",
                    textEn: "النص (إنجليزي)",
                    textAr: "النص (عربي)",
                    rating: "التقييم (1-5 نجوم)",
                    imageUrl: "رابط الصورة",
                    placeholderNameEn: "Sarah Johnson",
                    placeholderNameAr: "سارة جونسون",
                    placeholderRoleEn: "CEO, TechStartup Inc",
                    placeholderRoleAr: "الرئيس التنفيذي",
                    placeholderTextEn: "شارك ما أعجبك أثناء العمل معاً...",
                    placeholderTextAr: "شارك ما أعجبك...",
                    placeholderImageUrl: "https://..."
                },
                personalInfo: {
                    title: "المعلومات الشخصية",
                    description: "حدّث سيرتك وبيانات التواصل وروابط السوشيال. يتم الحفظ في localStorage.",
                    nameEn: "الاسم (إنجليزي)",
                    nameAr: "الاسم (عربي)",
                    email: "البريد الإلكتروني",
                    locationEn: "الموقع (إنجليزي)",
                    locationAr: "الموقع (عربي)",
                    avatarUrl: "رابط الصورة",
                    bioEn: "النبذة (إنجليزي)",
                    bioAr: "النبذة (عربي)",
                    socialLinks: "روابط التواصل",
                    github: "GitHub",
                    linkedin: "LinkedIn",
                    twitter: "Twitter / X",
                    instagram: "Instagram",
                    facebook: "Facebook",
                    telegram: "Telegram",
                    whatsapp: "WhatsApp",
                    floatingSkills: "أيقونات المهارات العائمة",
                    floatingSkillsLabel: "المهارات حول الصورة (مفصولة بفواصل، حد أقصى 6)",
                    floatingSkillsHelp: "أمثلة: React, Flutter, TypeScript, Node.js, Python, Figma, Next.js وغيرها.",
                    cvResume: "السيرة الذاتية",
                    cvUrl: "رابط تحميل السيرة",
                    placeholderAvatar: "https://...",
                    placeholderFloating: "React, Flutter, TypeScript, Node.js, Figma, Next.js",
                    placeholderCv: "https://example.com/cv.pdf",
                    placeholderGithub: "https://github.com/...",
                    placeholderLinkedin: "https://linkedin.com/in/...",
                    placeholderTwitter: "https://twitter.com/...",
                    placeholderInstagram: "https://instagram.com/...",
                    placeholderFacebook: "https://facebook.com/...",
                    placeholderTelegram: "https://t.me/...",
                    placeholderWhatsapp: "https://wa.me/..."
                },
                educationItem: {
                    gpaLabel: "المعدل"
                }
            }
        },
        footer: {
            rights: "جميع الحقوق محفوظة."
        }
    }
};
