const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

var User = require('./user');

// 매물형태 -> "음식점", "패스트푸드", "주류점", "오락/스포츠", "판매점", "서비스업/기타", "상가주택/빌딩매매", "점포매매", "분양상가"

const schema = new Schema({
  no: { type: Number, required: true, default: 0 },
  personInCharge: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['in_progress', 'complete'], required: true }, // 계약진행상태
  type: { type: String, required: true }, // 매물 형태 대분류. 선택 하게끔 구현
  typeDetail: { type: String, required: true }, // 매물 형태 소분류. 입력하게 끔 구현
  title: { type: String, required: true, trim: true }, // 제목
  address1: { type: String, required: true, trim: true },
  address2: { type: String, required: true, trim: true },
  zip: { type: String, required: true, trim: true },
  currentBusinessType: { type: String, required: true, trim: true }, // 현업종
  suggestedBusinessType: { type: String, required: true, trim: true }, // 추천업종
  sizeSupplyPyeong: { type: Number, required: true }, // 공급면적
  sizeSupplySquareMeter: { type: Number, required: true },
  sizeExclusivePyeong: { type: Number, required: false }, // 전용면젹
  sizeExclusiveSquareMeter: { type: Number, required: false },
  floor: { type: String, required: true },
  deposit: { type: Number, required: true }, // 보증금
  premium: { type: Number, required: true }, // 권리금
  sumDepositAndPremium: { type: Number, required: true }, // 보증금 + 권리금
  monthlyRevenue: { type: Number, required: false },// 월수익
  monthlyRent: { type: Number, required: false }, // 월세
  description: { type: String, required: true }, // 기본 상세 내용
  remarks: { type: String, required: true }, // 비고
  priority: { type: String, enum: ['a', 'b', 'c'], required: true, trim: true }, // 중요도 (A~C)
  deleteYn: { type: String, required: false, default: 'N' },
});

autoIncrement.initialize(mongoose.connection);
schema.plugin(autoIncrement.plugin, {
  model: 'RealProperty', field: 'no', startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model('RealProperty', schema, 'realProperties');

// 소재지
// "인천 강화군" x, "인천 계양구", "인천 남구", "인천 남동구", "인천 동구",
// "인천 부평구", "인천 서구", "인천 연수구", "인천 옹진군" x, "인천 중구", "경기 부천시 소사구", "경기 부천시 오정구", "경기 부천시 원미구"]

//
// "인천 강화군" -> "길상면", "송해면", "양도면" -> x
// "인천 계양구" -> "계산동", "귤현동", "다남동", "동양동", "둑실동", "박촌동", "병방동", "상야동", "서운동", "용종동", "임학동", "작전동", "장기동", "효성동"
// "인천 남구" -> "관교동", "도화동", "문학동", "숭의동", "용현동", "주안동", "학익동"
// "인천 남동구" -> "간석동", "고잔동", "구월동", "남촌동", "논현동", "도림동", "만수동", "서창동", "수산동", "장수동"
// "인천 동구" -> "금곡동", "만석동", "송림동", "송현동", "창영동", "화수동", "화평동"
// "인천 부평구" ->  "갈산동", "구산동", "부개동", "부평동", "산곡동", "삼산동", "십정동", "일신동", "청천동"
// "인천 서구" ->  "가정동", "가좌동", "검암동", "경서동", "공촌동", "금곡동", "당하동", "마전동", "백석동", "불로동", "석남동", "신현동", "심곡동", "연희동", "왕길동", "원당동", "원창동"
// "인천 연수구" -> "동춘동", "선학동", "송도동", "연수동", "옥련동", "청학동"
// "인천 옹진군" -> x
// "인천 중구" ->  "경동", "관동", "내동", "답동", "도원동", "북성동", "사동", "선화동", "신생동", "신포동", "신흥동", "운서동", "율목동", "인현동", "전동", "중산동", "중앙동", "항동"
// "경기 부천시 소사구" -> "괴안동", "소사본동", "송내동", "심곡본동", "역곡동"
// "경기 부천시 오정구" -> "고강동", "고강본동", "삼정동", "여월동", "오정동", "원종동", "작동"
// "경기 부천시 원미구" -> "도당동", "상동", "소사동", "심곡동", "약대동", "역곡동", "원미동", "중동", "춘의동"


//
// (면적*0.30258=평)  과  (면적/3.3=평) 이렇게 두가지입니다.
//   위의 면적을 대입해보면...
// 1. {(10*35)*0.30258}=105.9평(혹은 105평 9홉이라고도 합니다.) 0.3025
// 2. {(10*35)/3.3}=106.06평
// 이렇게 계산하시면 됩니다.

// 입력은 만원 단위
// 10,000
