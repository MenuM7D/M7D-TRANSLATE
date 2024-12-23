// التحقق من دعم المتصفح لـ Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // تسجيل الـ Service Worker
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('تم تسجيل Service Worker بنجاح:', registration.scope);
    }).catch(error => {
      console.log('فشل تسجيل Service Worker:', error);
    });
  });
}

let timeout;

// دالة الترجمة
async function translateText() {
  const fromLanguage = document.getElementById('fromLanguage').value;
  const toLanguage = document.getElementById('toLanguage').value;
  let inputText = document.getElementById('inputText').value;

  // إزالة الفواصل والنقاط
  inputText = inputText.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");

  if (!inputText.trim()) {
    document.getElementById('outputText').value = '';
    return;
  }

  clearTimeout(timeout);

  timeout = setTimeout(async function() {
    try {
      const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${fromLanguage}|${toLanguage}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.responseStatus === 200 && data.responseData.translatedText) {
        document.getElementById('outputText').value = data.responseData.translatedText;
      } else {
        document.getElementById('outputText').value = "تعذر الترجمة. حاول مرة أخرى.";
      }
    } catch (error) {
      console.error('خطأ أثناء الترجمة:', error);
      document.getElementById('outputText').value = "حدث خطأ أثناء الترجمة. حاول مرة أخرى.";
    }
  }, 1000);
}

// إضافة الحدث لتغييرات النص المدخل
document.getElementById('inputText').addEventListener('input', translateText);
document.getElementById('fromLanguage').addEventListener('change', translateText);
document.getElementById('toLanguage').addEventListener('change', translateText);

// وظيفة نطق النص
async function speakText(text, voiceName) {
  const encodedText = encodeURIComponent(text);
  const url = `https://api.streamelements.com/kappa/v2/speech?voice=${voiceName}&text=${encodedText}`;

  try {
    const response = await fetch(url);
    const audioData = await response.blob();
    const audioUrl = URL.createObjectURL(audioData);

    const audio = new Audio(audioUrl);
    audio.play();
  } catch (error) {
    console.error('خطأ أثناء نطق النص:', error);
    alert("حدث خطأ أثناء نطق النص.");
  }
}

// إضافة الأحداث للأزرار
document.getElementById('speakInputText').addEventListener('click', function() {
  const inputText = document.getElementById('inputText').value;
  const voiceName = document.getElementById('voiceSelect').value;
  if (inputText.trim()) {
    speakText(inputText, voiceName);
  } else {
    alert("يرجى إدخال نص أولاً.");
  }
});

document.getElementById('speakOutputText').addEventListener('click', function() {
  const outputText = document.getElementById('outputText').value;
  const voiceName = document.getElementById('voiceSelect').value;
  if (outputText.trim()) {
    speakText(outputText, voiceName);
  } else {
    alert("يرجى ترجمة النص أولاً.");
  }
});
