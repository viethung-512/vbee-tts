import { DialectType, isEmpty, ServiceResponse } from '@tts-dev/common';
import axios from 'axios';
import cheerio from 'cheerio';
// import HtmlEntities from 'html-entities';

// eslint-disable-next-line global-require
const entities = new (require('html-entities').AllHtmlEntities)();

interface GetAllophoneResponse extends ServiceResponse {
  allophone?: string;
}

interface GetAllophoneArgs {
  text: string;
  voice: string;
  dialect?: DialectType;
}

interface ExtractAllophoneResponse extends ServiceResponse {
  allophoneContent?: string;
  pronunciation?: string;
}

function extractAllophone(
  text: string,
  allophone: string
): ExtractAllophoneResponse {
  try {
    const $ = cheerio.load(allophone, { xmlMode: true, decodeEntities: true });
    const phraseLength = $('phrase').length;
    const phraseHtmlContent = $('phrase').html();

    if (phraseLength !== 1) {
      return { success: false, errors: [{ message: 'More than 1 phrase' }] };
    }
    if (!phraseHtmlContent || isEmpty(phraseHtmlContent)) {
      return {
        success: false,
        errors: [{ message: 'Phrase content must not empty' }],
      };
    }

    let allophoneContent = phraseHtmlContent.trim();

    const startBoundary = allophoneContent.lastIndexOf('<boundary');
    const punctuation = /[!-/:-@[-`{-~¡-©«-¬®-±´¶-¸»¿×÷˂-˅˒-˟˥-˫˭˯-˿͵;΄-΅·϶҂՚-՟։-֊־׀׃׆׳-״؆-؏؛؞-؟٪-٭۔۩۽-۾܀-܍߶-߹।-॥॰৲-৳৺૱୰௳-௺౿ೱ-ೲ൹෴฿๏๚-๛༁-༗༚-༟༴༶༸༺-༽྅྾-࿅࿇-࿌࿎-࿔၊-၏႞-႟჻፠-፨᎐-᎙᙭-᙮᚛-᚜᛫-᛭᜵-᜶។-៖៘-៛᠀-᠊᥀᥄-᥅᧞-᧿᨞-᨟᭚-᭪᭴-᭼᰻-᰿᱾-᱿᾽᾿-῁῍-῏῝-῟῭-`´-῾\u2000-\u206e⁺-⁾₊-₎₠-₵℀-℁℃-℆℈-℉℔№-℘℞-℣℥℧℩℮℺-℻⅀-⅄⅊-⅍⅏←-⏧␀-␦⑀-⑊⒜-ⓩ─-⚝⚠-⚼⛀-⛃✁-✄✆-✉✌-✧✩-❋❍❏-❒❖❘-❞❡-❵➔➘-➯➱-➾⟀-⟊⟌⟐-⭌⭐-⭔⳥-⳪⳹-⳼⳾-⳿⸀-\u2e7e⺀-⺙⺛-⻳⼀-⿕⿰-⿻\u3000-〿゛-゜゠・㆐-㆑㆖-㆟㇀-㇣㈀-㈞㈪-㉃㉐㉠-㉿㊊-㊰㋀-㋾㌀-㏿䷀-䷿꒐-꓆꘍-꘏꙳꙾꜀-꜖꜠-꜡꞉-꞊꠨-꠫꡴-꡷꣎-꣏꤮-꤯꥟꩜-꩟﬩﴾-﴿﷼-﷽︐-︙︰-﹒﹔-﹦﹨-﹫！-／：-＠［-｀｛-･￠-￦￨-￮￼-�]|\ud800[\udd00-\udd02\udd37-\udd3f\udd79-\udd89\udd90-\udd9b\uddd0-\uddfc\udf9f\udfd0]|\ud802[\udd1f\udd3f\ude50-\ude58]|\ud809[\udc00-\udc7e]|\ud834[\udc00-\udcf5\udd00-\udd26\udd29-\udd64\udd6a-\udd6c\udd83-\udd84\udd8c-\udda9\uddae-\udddd\ude00-\ude41\ude45\udf00-\udf56]|\ud835[\udec1\udedb\udefb\udf15\udf35\udf4f\udf6f\udf89\udfa9\udfc3]|\ud83c[\udc00-\udc2b\udc30-\udc93]/;
    const isPunctuationLastCharacter = punctuation.test(text[text.length - 1]);
    if (startBoundary > -1 && !isPunctuationLastCharacter) {
      allophoneContent = allophoneContent.substring(0, startBoundary).trim();
    }

    const pronunciation: string[] = [];
    $('t').each(function () {
      // @ts-ignore
      const token = $(this).text();
      pronunciation.push(token);
    });

    return {
      success: true,
      pronunciation: pronunciation.join(' ').replace(/\n/g, ''),
      allophoneContent: entities.decode(allophoneContent),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      errors: [{ message: 'Error while extract allophone content' }],
    };
  }
}

const getPronunciationAndAllophoneContent = async (
  args: GetAllophoneArgs
): Promise<ExtractAllophoneResponse> => {
  const { text, voice, dialect } = args;
  try {
    const trimText = text.trim();
    const { success, errors, allophone } = await getAllophone({
      text: trimText,
      voice,
      dialect,
    });

    if (!success) {
      return { success: false, errors: errors };
    }

    const {
      success: extractSuccess,
      errors: extractErrors,
      pronunciation,
      allophoneContent,
    } = extractAllophone(trimText, allophone!);
    if (!extractSuccess) {
      return { success: false, errors: extractErrors };
    }

    return { success: true, pronunciation, allophoneContent };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      errors: [
        { message: 'Error while get pronunciation and add allophone content' },
      ],
    };
  }
};

const getAllophonesByCloudAPI = async (
  args: GetAllophoneArgs
): Promise<GetAllophoneResponse> => {
  const { text, voice } = args;
  try {
    const { data } = await axios({
      method: 'POST',
      url: 'http://tts-vb.vbeecore.com/api/v1/tts',
      data: {
        function_call_invoke:
          'arn:aws:lambda:ap-southeast-1:203444622944:function:serverless-tts-vbee-vn-tts',
        text: 'TEXT',
        input_text: text,
        voice,
        output_type: 'ALLOPHONES',
      },
    });

    if (data.error !== 0) {
      throw new Error();
    }

    return { success: true, allophone: data.message };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      errors: [{ message: 'Error while convert text to allophone-CloudAPI' }],
    };
  }
};

const getAllophone = async (
  args: GetAllophoneArgs
): Promise<GetAllophoneResponse> => {
  const { text, voice, dialect } = args;

  try {
    const { data: allophone } = await axios({
      method: 'GET',
      url: 'https://prod-deploy.vbeecore.com/process',
      params: {
        INPUT_TEXT: text,
        VOICE: voice,
        DIALECT: dialect,
        INPUT_TYPE: 'TEXT',
        OUTPUT_TYPE: 'ALLOPHONES',
        LOCALE: 'vi_VN',
      },
    });
    return { success: true, allophone };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      errors: [{ message: 'Error while convert text to allophone' }],
    };
  }
};

const allophoneService = {
  getAllophone,
  getAllophonesByCloudAPI,
  getPronunciationAndAllophoneContent,
};

export { allophoneService };
