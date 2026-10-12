const $ = (id) => document.getElementById(id);

const pageEl = $("page");
const emojiEl = $("emoji");
const eyebrowEl = $("eyebrow");
const titleEl = $("title");
const descriptionEl = $("description");
const contentEl = $("content");
const feedbackEl = $("feedback");
const actionsEl = $("actions");
const progressEl = $("progress");

let transitionTimer = null;
let dodgeCount = 0;
let noCount = 0;
let apologyMore = false;

const themes = [
  "theme-welcome",
  "theme-miss",
  "theme-princess",
  "theme-kiss",
  "theme-choice",
  "theme-apology",
  "theme-final"
];

const apologyText = `لجججج شعبوطتييي 😭❤️

آني شعندي غيرج حتى تزعلين مني هيچ؟ لججج تزعلين مني علمود بوسة؟ 😂😭 خاب عيني لو أدري البوسة غالية عليج هيچ جان انطيتج عشر بوسات مو وحدة، وعشر بعدهن احتياط 😂💋💋💋

يا بعد عيون شعيوط إنتِ، يا أحلى أميرة بهالدنيا، يا فراولتي المغطّسة بالعسل 🍓🤍

تره من تزعلين آني هم أزعل، ومن أشوفج مو راضية عليّ أحس الدنيا كلها مو حلوة. شلون أتهنّى وآني أميرتي زعلانة مني؟ 🥹

تعالي يمعودة خلّيني أراضيج، أدلّلج، وأسمعج أحلى حچي، وأعوّضج عن كل بوسة ما انطيتج يا روحي 😂❤️

إنتِ مو أي وحدة بحياتي، إنتِ شعبوطتي، ودلوعتي، وأميرتي المدلّلة، واللي مهما أعاند وياها بالنهاية أجي أراضيها وأگوللها: حقج عليّ يا روحي. 🫂💗

بس هم عندي سؤال صغيررر 😂😂 إذا أنطيج عشر بوسات هسه، ترضين؟ لو تريدين غرامة تأخير هم؟ 😭💋

أحبج يا أحلى شعبوطه بالكون، ويا رب أشوف ضحكتج أحلى من زعلج دوم. ❤️👑`;

function button(label, className, callback) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = className;
  b.textContent = label;
  b.addEventListener("click", callback);
  actionsEl.appendChild(b);
  return b;
}

function setFeedback(message) {
  feedbackEl.textContent = message;
  feedbackEl.classList.add("visible");
}

function clearFeedback() {
  feedbackEl.textContent = "";
  feedbackEl.classList.remove("visible");
}

function readingDelay(message, requestedDelay = 0) {
  const basedOnLength = 3500 + message.length * 55;

  return Math.max(
    5500,
    requestedDelay || 0,
    Math.min(15000, basedOnLength)
  );
}

function respondThenGo(message, nextPage, requestedDelay = 0) {
  clearTimeout(transitionTimer);
  setFeedback(message);
  actionsEl.replaceChildren();

  const wait = readingDelay(message, requestedDelay);

  transitionTimer = setTimeout(() => {
    showPage(nextPage);
  }, wait);
}

function showReplyWithButton(message, label, callback) {
  clearTimeout(transitionTimer);
  setFeedback(message);
  actionsEl.replaceChildren();
  button(label, "btn-primary", callback);
}

function makeRunaway(label, message, afterClick) {
  const runway = document.createElement("div");
  runway.className = "runway";

  const b = document.createElement("button");
  b.type = "button";
  b.className = "btn-soft runaway";
  b.textContent = label;

  runway.appendChild(b);
  actionsEl.appendChild(runway);

  let position = 50;
  let lastMove = 0;
  let caught = false;

  function moveSideways() {
    if (caught) return;

    const now = Date.now();
    if (now - lastMove < 200) return;

    lastMove = now;

    const direction = Math.random() < 0.5 ? -1 : 1;
    position += direction * (20 + Math.random() * 24);

    if (position < 15) position = 80;
    if (position > 85) position = 20;

    b.style.left = `${position}%`;
  }

  b.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") {
      moveSideways();
    }
  });

  b.addEventListener("touchstart", (event) => {
    event.preventDefault();
    moveSideways();
  }, { passive: false });

  b.addEventListener("click", () => {
    if (caught) return;

    dodgeCount++;

    if (dodgeCount < 4) {
      const jokes = [
        "هاااا 😂😂 شنو عبالج تلحگين عليه بسهولة؟",
        "شعيوط مبرمج الزر على الهروب من المشاكل مثله بالضبط 😭🤣",
        "قربتييي! بس الزر عنده واسطة وهرب 😂❤️"
      ];

      setFeedback(jokes[dodgeCount - 1]);
      moveSideways();
      return;
    }

    caught = true;
    setFeedback(message);
    b.remove();
    afterClick();
  });

  return b;
}

function addOptions(options) {
  options.forEach((option) => {
    button(
      option.label,
      option.className || "btn-primary",
      option.action
    );
  });
}

function showPage(number) {
  clearTimeout(transitionTimer);
  dodgeCount = 0;

  if (number === 7) {
    showPrincessTest();
    return;
  }

  document.body.classList.remove(...themes);
  document.body.classList.add(
    themes[Math.min(number, themes.length - 1)]
  );

  progressEl.style.width = `${((number + 1) / 7) * 100}%`;

  pageEl.classList.remove("entering");
  void pageEl.offsetWidth;
  pageEl.classList.add("entering");

  actionsEl.replaceChildren();
  contentEl.replaceChildren();
  clearFeedback();

  const data = pages[number];

  emojiEl.textContent = data.emoji;
  eyebrowEl.textContent = data.eyebrow;
  titleEl.textContent = data.title;
  descriptionEl.textContent = data.description || "";

  if (data.render) {
    data.render();
  } else if (data.content) {
    contentEl.textContent = data.content;
  }

  if (data.actions) {
    data.actions();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

const pages = [
  {
    emoji: "🍓🍯💗",
    eyebrow: "رسالة من شعيوط إلى أميرته",
    title: "ويّانه الحلوة شعبوطه، الفراولة المغطّسة بالعسل؟",
    description: "أكو أميرة دخلت الموقع؟ لو الفراولة نفسها مشتاقتلي؟ 😂🍓",

    actions() {
      button(
        "نعم، الأميرة شعبوطه شخصياً ❤️",
        "btn-primary",
        () => {
          respondThenGo(
            "يا هلاااا بأميرة شعيوط المدلّلة! 👑❤️ تفضّلي، بس انتبهي… الموقع بيه فيكات أخطر من زعلج 😂🍓",
            1
          );
        }
      );
    }
  },

  {
    emoji: "🥹❤️",
    eyebrow: "السؤال الأول",
    title: "أويلي فدد مشتاق لشعبوطتي!",
    description: "إنتِ هم مشتاقه لشعيوط؟ جاوبي بصراحة، ترى الموقع يعرف إذا تكذبين… يمكن 😂",

    actions() {
      addOptions([
        {
          label: "إي مشتاقتلك ❤️",
          className: "btn-primary",

          action() {
            respondThenGo(
              "هاااا عرفتج 😂❤️ تعالي لهنا يا بعد روحي! شعيوط من الصبح يسوي نفسه قوي وهو كل شوي يشيّك إذا شعبوطه ردّت عليه 😭💗",
              2
            );
          }
        },

        {
          label: "لا 🙄",
          className: "btn-soft",

          action() {
            noCount++;

            const message = noCount === 1
              ? "هااااا 😂😂❤️ يعني مو مشتاقتلي؟ زين زين، خلي نشوف إذا تكدرين تمسكين الزر وتثبتين على رأيج! 😭❤️"
              : "بعدج مصممة ما تشتاقين؟ 😂😭 عيني عالأصرار! بس شعيوط ما يصدّگج بسهولة ❤️🍓";

            actionsEl.replaceChildren();
            setFeedback(message);

            makeRunaway(
              "لا، مو مشتاقتلك 😌",

              "انكشفتييي 😂❤️ حتى الزر تعب من عنادج! يلا نعترف بالاشتياق ونكمل.",

              () => {
                showReplyWithButton(
                  "هاااا شفتِ شلون؟ 😂❤️ يلا نكمل، شعيوط يريد يعرف منو أحلى أميرة!",

                  "يلا ورّيني 😌👑",

                  () => showPage(2)
                );
              }
            );
          }
        }
      ]);
    }
  },

  {
    emoji: "👑✨",
    eyebrow: "فحص الأميرة الرسمي",
    title: "تدرين إنتِ أحلى أميرة بالكون؟",
    description: "هذا سؤال مهم جداً، ونتيجته راح تحدد كمية الدلع الممنوحة إلج 😂",

    actions() {
      addOptions([
        {
          label: "إي طبعاً 😌👑",
          className: "btn-primary",

          action() {
            respondThenGo(
              "شايفة نفسج؟ 😂❤️ بس هالمرة عندج حق، لأن شعيوط بنفسه مصوّت إلج ملكة الكون! 👑🍓",
              3
            );
          }
        }
      ]);

      makeRunaway(
        "لا، أكو أحلى مني 🤭",

        "خطأ فادح! 🚨😂 تم إيقاف نظام التواضع لأن شعبوطه أجمل من أن تتواضع!",

        () => {
          showReplyWithButton(
            "شعبوطه، حتى نظام الموقع ما اقتنع بجوابج 😂👑",
            "زين زين، أني الأميرة 😌❤️",
            () => showPage(3)
          );
        }
      );
    }
  },

  {
    emoji: "💋😂",
    eyebrow: "ملف البوسة المفقودة",
    title: "صدك كل هذا الزعل علمود البوسة؟",
    description: "يرجى اختيار نوع العقوبة المناسبة للمتهم شعيوط. المحكمة منعقدة برئاسة الأميرة 👩🏻‍⚖️❤️",

    actions() {
      addOptions([
        {
          label: "أعطيه بوسة افتراضية 💋",
          className: "btn-primary",

          action() {
            respondThenGo(
              "اعتراض يا حضرة القاضية! 😂💋 المتهم يريد يعيد المحاكمة حتى يحصل بوسة ثانية وثالثة!",
              4
            );
          }
        },

        {
          label: "أخليه ينتظر شوي 😂",
          className: "btn-soft",

          action() {
            respondThenGo(
              "يا ساتر 😂😭 شعيوط هسه فاتح الموقع ويحسب الثواني… حتى الإنترنت صار يشفق عليه! 📶💔",
              4
            );
          }
        },

        {
          label: "على حسب مزاجي 😌",
          className: "btn-white",

          action() {
            respondThenGo(
              "يعني الموضوع يحتاج موافقة لجنة المزاج العليا؟ 😂👑 حاضر أميرتي، بس لا تخلّين الطلب قيد المراجعة سنة كاملة!",
              4
            );
          }
        }
      ]);
    }
  },

  {
    emoji: "🤨💗",
    eyebrow: "جلسة تفاوض",
    title: "منو المفروض يراضي الثاني هسه؟",
    description: "اختاري بحكمة… لأن شعيوط محضّر ردود قانونية ومرافعة كلها دلع 😂",

    actions() {
      addOptions([
        {
          label: "شعيوط طبعاً! 😤❤️",
          className: "btn-primary",

          action() {
            setFeedback(
              "حاضر حاضر 😂😭 بس قبل الاعتذار النهائي، عندج طلب صغير لازم تجاوبين عليه!"
            );

            actionsEl.replaceChildren();

            makeRunaway(
              "لا، إنتِ تراضيني 🙂‍↔️",

              "لاااا أشاقه وياج 😂😭❤️ آني أراضي أحلى أميرة بالكون، وأحلى شعبوطه، شعندي غيرها آني؟!",

              () => {
                showReplyWithButton(
                  "هاااا خلصنا عناد؟ 😂❤️ يلا هسه وقت الاعتذار الرسمي.",
                  "يلا أسمع اعتذارك يا شعيوط 🥹",
                  () => showPage(5)
                );
              }
            );
          }
        },

        {
          label: "إحنا الاثنين نتصالح ❤️",
          className: "btn-soft",

          action() {
            respondThenGo(
              "أويلييي شكد أحب شعبوطتي 😭❤️ متعاند وتحلها بساع، تعالي يا أحلى أميرة بالكون!",
              5
            );
          }
        },

        {
          label: "هو يعرف شيسوي حتى يرضيني 😂",
          className: "btn-white",

          action() {
            showReplyWithButton(
              "لا ما اعرف شسوي رجعي دوسي غير شي 😂😂",
              "ههههه زين، أختار غير جواب 😂",
              () => showPage(4)
            );
          }
        }
      ]);
    }
  },

  {
    emoji: "🌹🫂❤️",
    eyebrow: "من قلب شعيوط",
    title: "شعبوطتي، تعالي أگولج شغلة…",
    description: "ملاحظة: الاعتذار يحتوي على كمية دلع أعلى من الحد المسموح 😂💗",

    render() {
      const box = document.createElement("div");
      box.className = "apology-text";
      box.textContent = apologyText;
      contentEl.appendChild(box);
    },

    actions() {
      button(
        "زين يلا سامحتك يا شعيوط 😂❤️",
        "btn-primary",
        () => {
          showReplyWithButton(
            "يااااا بعد روحي 😭❤️ بس لحظة، قبل ما نعلن الصلح رسمياً لازم نتأكد من رضا الأميرة!",
            "يلا نتأكد 😂❤️",
            () => showPage(6)
          );
        }
      );

      button(
        "بعدني زعلانة، دلّلني أكثر 😌",
        "btn-soft",
        () => {
          if (!apologyMore) {
            apologyMore = true;

            showReplyWithButton(
              "لججج بعد شتريدين أكثر من هيچ؟ 😂😭❤️ حاضر: إنتِ أحلى صدفة، وأحلى ضحكة، وأحلى أميرة بحياة شعيوط. وإذا الدلع ينقاس بالكيلو، جان غرّقتج بيه! 🍓👑",

              "هسه أحسن 😂❤️",

              () => {
                showReplyWithButton(
                  "الحمد لله، رجع الأمل للمفاوضات 😂🫂 يلا نشوف الأميرة رضت لو بعد!",
                  "يلا نشوف 😌",
                  () => showPage(6)
                );
              }
            );
          } else {
            showReplyWithButton(
              "آني غلطان من البداية، جان لازم أدلّلج قبل لا تزعلين يا بعد روحي 😂❤️",
              "خلاص، خل نشوف شنو بعد 😂",
              () => showPage(6)
            );
          }
        }
      );
    }
  },

  {
    emoji: "🥹👑💗",
    eyebrow: "آخر مرحلة قبل التتويج",
    title: "هااا شعبوطتي، رضيتي لو بعدج؟",
    description: "الجواب النهائي يترتب عليه صرف ميزانية البوسات 😂💋",

    actions() {
      addOptions([
        {
          label: "إي رضيت ❤️",
          className: "btn-primary",

          action() {
            showReplyWithButton(
              "لحظة لحظة 😂 شنو هالسرعة؟ شعيوط بعده ما كمّل اعتذاره! متأكدة مو بس تريدين البوسات؟ 💋🤣",

              "إي متأكدة يا غبي 😂❤️",

              () => {
                showReplyWithButton(
                  "زين زين 😂❤️ بس عندي سر صغير إلج… افتحي الظرف!",

                  "💌 افتحي الظرف السري",

                  () => {
                    showReplyWithButton(
                      "السر هو: مهما تتعاركين وياي، تبقين أميرتي الحلوة، وأحب أشوفج تضحكين أكثر من أي شي. أحبج يا شعبوطه ❤️🍓",

                      "يلا للاختبار الملكي 👑",

                      () => showPage(7)
                    );
                  }
                );
              }
            );
          }
        },

        {
          label: "لا، بعدني زعلانة 😤",
          className: "btn-soft",

          action() {
            showReplyWithButton(
              "يا ساتررر 😂😭 بعدج؟ شعيوط اعتذر ومدح ووعد بعشر بوسات! شنو بعد تريدين يا أميرة؟ قصر لو مملكة؟ 👑🤣",

              "بعدني أريد دلع أكثر 😌",

              () => {
                showReplyWithButton(
                  "آني غلطان من البداية، جان لازم أدلّلج قبل لا تزعلين يا بعد روحي 😂❤️",

                  "خلاص، سامحتك هالمرة 😂❤️",

                  () => {
                    showReplyWithButton(
                      "أوووف الحمد لله 😂🫂 هسه نكدر نكمل للمصالحة الملكية!",

                      "يلا للاختبار الملكي 👑",

                      () => showPage(7)
                    );
                  }
                );

                makeRunaway(
                  "لا، ما سامحتك أبد!",

                  "حتى زر عدم المسامحة مستحي منج 😂😂❤️",

                  () => {
                    showReplyWithButton(
                      "هاااا حتى الزر يريد الصلح 😂❤️",
                      "خلاص، سامحتك ❤️",
                      () => showPage(7)
                    );
                  }
                );
              }
            );
          }
        }
      ]);
    }
  }
];

function showPrincessTest() {
  clearTimeout(transitionTimer);

  document.body.classList.remove(...themes);
  document.body.classList.add("theme-final");

  progressEl.style.width = "100%";

  actionsEl.replaceChildren();
  contentEl.replaceChildren();
  clearFeedback();

  emojiEl.textContent = "👑🍓";
  eyebrowEl.textContent = "اختبار تحديد الأميرة";
  titleEl.textContent = "منو أحلى أميرة بالكون؟";
  descriptionEl.textContent = "ركّزي زين، هذا أصعب سؤال بتاريخ البشرية 😂❤️";

  button(
    "شعبوطه طبعاً 😌👑",
    "btn-primary",
    () => {
      showReplyWithButton(
        "الجواب صحيح! الجائزة عشر بوسات من شعيوط 😂💋❤️",

        "استلام الجائزة 💋",

        () => {
          showReplyWithButton(
            "💋💋💋💋💋💋💋💋💋💋\nمبروك يا أميرة! انتهت المهمة بنجاح ❤️🍓",

            "إعادة الموقع من البداية 🔄",

            () => {
              apologyMore = false;
              noCount = 0;
              showPage(0);
            }
          );
        }
      );
    }
  );

  button(
    "أكو أميرة أحلى؟ 🤭",
    "btn-soft",
    () => {
      showReplyWithButton(
        "خطأ بالنظام! ماكو أميرة غير شعبوطه 😂😭❤️",
        "أعيد المحاولة 😂",
        showPrincessTest
      );
    }
  );

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function createHeart() {
  const heart = document.createElement("span");
  heart.className = "floating-heart";

  const choices = ["❤️", "💗", "💕", "🍓", "✨", "💖"];

  heart.textContent =
    choices[Math.floor(Math.random() * choices.length)];

  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${14 + Math.random() * 18}px`;
  heart.style.animationDuration = `${6 + Math.random() * 7}s`;

  $("hearts").appendChild(heart);

  setTimeout(() => heart.remove(), 14000);
}

setInterval(createHeart, 800);

showPage(0);