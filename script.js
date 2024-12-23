let timeout;
async function translateText() {
  const fromLanguage = document.getElementById('fromLanguage').value;
  const toLanguage = document.getElementById('toLanguage').value;
  const inputText = document.getElementById('inputText').value;

  // التأكد من وجود نص للترجمة
  if (!inputText.trim()) {
    document.getElementById('outputText').value = ''; // إفراغ الحقل في حالة عدم وجود نص
    return;
  }

  // إلغاء الترجمة القديمة إذا تم الكتابة بعد فترة قصيرة
  clearTimeout(timeout);

  // إضافة تأخير بعد توقف الكتابة قبل البدء في الترجمة
  timeout = setTimeout(async function() {
    try {
      // إرسال الطلب إلى MyMemory API مع التأكد من ترميز النص بشكل صحيح
      const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${fromLanguage}|${toLanguage}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      // فحص حالة الاستجابة والتأكد من وجود الترجمة الصحيحة
      if (data.responseStatus === 200 && data.responseData.translatedText) {
        document.getElementById('outputText').value = data.responseData.translatedText;
      } else {
        // إذا كانت هناك مشكلة في الترجمة، إظهار رسالة مناسبة
        document.getElementById('outputText').value = "تعذر الترجمة. حاول مرة أخرى.";
      }
    } catch (error) {
      console.error('خطأ أثناء الترجمة:', error);
      document.getElementById('outputText').value = "حدث خطأ أثناء الترجمة. حاول مرة أخرى.";
    }
  }, 1000); // تأخير لمدة 1 ثانية بعد توقف الكتابة (يمكنك زيادة أو تقليل الوقت حسب الحاجة)
}

// إضافة الحدث للتغييرات في حقل النص المدخل
document.getElementById('inputText').addEventListener('input', translateText);

// إضافة الحدث لتغيير لغات الترجمة
document.getElementById('fromLanguage').addEventListener('change', translateText);
document.getElementById('toLanguage').addEventListener('change', translateText);

// وظيفة نطق النصوص باستخدام API
async function speakText(text, voiceName) {
  const encodedText = encodeURIComponent(text); // ترميز النص
  const url = `https://api.streamelements.com/kappa/v2/speech?voice=${voiceName}&text=${encodedText}`;

  try {
    const response = await fetch(url);
    const audioData = await response.blob(); // تحميل الصوت
    const audioUrl = URL.createObjectURL(audioData); // إنشاء رابط صوتي

    const audio = new Audio(audioUrl); // تشغيل الصوت
    audio.play();
  } catch (error) {
    console.error('خطأ أثناء نطق النص:', error);
    alert("حدث خطأ أثناء نطق النص.");
  }
}

// إضافة الأحداث عند الضغط على أزرار النطق
document.getElementById('speakInputText').addEventListener('click', function() {
  const inputText = document.getElementById('inputText').value;
  const voiceName = document.getElementById('voiceSelect').value; // الحصول على الصوت المحدد
  if (inputText.trim()) {
    speakText(inputText, voiceName);
  } else {
    alert("يرجى إدخال نص أولاً.");
  }
});

document.getElementById('speakOutputText').addEventListener('click', function() {
  const outputText = document.getElementById('outputText').value;
  const voiceName = document.getElementById('voiceSelect').value; // الحصول على الصوت المحدد
  if (outputText.trim()) {
    speakText(outputText, voiceName);
  } else {
    alert("يرجى ترجمة النص أولاً.");
  }
});
