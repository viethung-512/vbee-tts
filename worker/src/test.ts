const textToImage = require('text-to-image');

const convert = async () => {
  const content =
    'Sau một hồi lời qua tiếng lại, ông Trump nói với người điều phối: “Tôi đoán là tôi đang tranh luận với ông, không phải ông ta”.';
  const imageForContent = await textToImage.generate(content, {
    fontSize: 20,
    margin: 0,
    maxWidth: 640,
  });

  console.log({ imageForContent });
};

convert();
