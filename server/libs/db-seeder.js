const mongoose = require('mongoose');
const User = require('../models/user');
const LocationGu = require('../models/location-gu');
const LocationDong = require('../models/location-dong');
const RealProperty = require('../models/real-property');
const bcrypt = require('bcryptjs');

const initUsers = [
  {
    username: 'yoyojyv',
    password: bcrypt.hashSync('jy20012864!', 10),
    name: '김재용',
    email: 'yoyojyv@gmail.com',
    mainPhone: '010-9373-0119',
    userPhone: '010-9373-0119',
    role: 'super_admin',
    deleted: false,
    created: new Date(),
  },
  {
    username: 'lsc2521',
    password: bcrypt.hashSync('Ddltmdcjf5814', 10),
    name: '이승철',
    email: 'lsc2521@naver.com',
    mainPhone: '010-3309-2521',
    userPhone: '010-3309-2521',
    role: 'super_admin',
    deleted: false,
    created: new Date(),
  },
];

const initGuList = [
  '인천 계양구', '인천 남구', '인천 남동구', '인천 동구',
  '인천 부평구', '인천 서구', '인천 연수구', '인천 중구',
  '경기 부천시 소사구', '경기 부천시 오정구', '경기 부천시 원미구',
];

const initDongList = [
  {
    gu: '인천 계양구',
    dongList: [
      '계산동', '귤현동', '다남동', '동양동', '둑실동', '박촌동', '병방동', '상야동', '서운동', '용종동', '임학동',
      '작전동', '장기동', '효성동',
    ],
  },
  {
    gu: '인천 남구',
    dongList: [
      "관교동", "도화동", "문학동", "숭의동", "용현동", "주안동", "학익동"
    ],
  },
  {
    gu: '인천 남동구',
    dongList: [
      "간석동", "고잔동", "구월동", "남촌동", "논현동", "도림동", "만수동", "서창동", "수산동", "장수동"
    ],
  },
  {
    gu: '인천 동구',
    dongList: [
      "금곡동", "만석동", "송림동", "송현동", "창영동", "화수동", "화평동"
    ],
  },
  {
    gu: '인천 부평구',
    dongList: [
      "갈산동", "구산동", "부개동", "부평동", "산곡동", "삼산동", "십정동", "일신동", "청천동"
    ],
  },
  {
    gu: '인천 서구',
    dongList: [
      "가정동", "가좌동", "검암동", "경서동", "공촌동", "금곡동", "당하동", "마전동", "백석동", "불로동", "석남동",
      "신현동", "심곡동", "연희동", "왕길동", "원당동", "원창동"
    ],
  },
  {
    gu: '인천 연수구',
    dongList: [
      "동춘동", "선학동", "송도동", "연수동", "옥련동", "청학동"
    ],
  },
  {
    gu: '인천 중구',
    dongList: [
      "경동", "관동", "내동", "답동", "도원동", "북성동", "사동", "선화동", "신생동", "신포동", "신흥동", "운서동",
      "율목동", "인현동", "전동", "중산동", "중앙동", "항동"
    ],
  },
  {
    gu: '경기 부천시 소사구',
    dongList: [
      "괴안동", "소사본동", "송내동", "심곡본동", "역곡동"

    ],
  },
  {
    gu: '경기 부천시 오정구',
    dongList: [
      "고강동", "고강본동", "삼정동", "여월동", "오정동", "원종동", "작동"
    ],
  },
  {
    gu: '경기 부천시 원미구',
    dongList: [
      "도당동", "상동", "소사동", "심곡동", "약대동", "역곡동", "원미동", "중동", "춘의동"
    ],
  },
];

class DBSeeder {

  init() {

    console.log('Starting dbSeeder...');

    mongoose.connection.db.listCollections({name: 'users'})
      .next((err, collinfo) => {
        if (!collinfo) {
          this.seedUsers();
        }
      });

    // mongoose.connection.db.listCollections({name: 'locationGu'})
    //   .next((err, collinfo) => {
    //     if (!collinfo) {
    //       console.log('Starting dbSeeder...');
    //       this.seedGuAndDongList();
    //     }
    //   });
    //
    // mongoose.connection.db.listCollections({name: 'realProperties'})
    //   .next((err, collinfo) => {
    //     if (!collinfo) {
    //       console.log('Starting dbSeeder...');
    //       // this.seedRealProperties();
    //     }
    //   });

    console.log('> End dbSeeder...');
  }

  seedUsers() {

    User.remove({});

    for (let i = 0; i < initUsers.length; i++) {
      let user = new User(initUsers[i]);
      user.save((err, u) => {
        if (err) {
          console.log(err);
        } else {
          console.log('inserted user: ' + u.username);
        }
      });
    }
  }

  seedGuAndDongList() {

    LocationGu.remove({});
    LocationDong.remove({});

    for (let i = 0; i < initGuList.length; i++) {
      let gu = new LocationGu({
        name: initGuList[i],
        order: (i + 1)
      });
      gu.save((err, ig) => {
        if (err) {
          console.log(err);
        } else {
          console.log('inserted gu: ' + ig.name);

          let targetDong = initDongList.find((d) => {
            return d.gu == ig.name;
          });

          console.log('targetDong ->')
          console.log(targetDong)

          for (let j = 0; j < targetDong.dongList.length; j++) {

            let dong = new LocationDong({
              gu: ig,
              name: targetDong.dongList[j],
              order: j + 1
            });

            console.log('dong->')
            console.log(dong)

            dong.save((err, d) => {
              if (err) {
                console.log(err);
              } else {
                console.log('inserted dong: ' + d.name);
              }
            });

          }
        }
      });
    }
  }

  async seedRealProperties() {

    let sampleUser = User.findOne({username: 'yoyojyv'}, (err, user) => {
      if (user) {


        const priorities = ['a', 'b', 'c'];

        for (let i=1;i<=30;i++) {

          let postfix = '_' + i;
          let priority = priorities[i % 3];

          let newProp = new RealProperty(
            {
              personInCharge: user,
              status: 'in_progress',
              type: '주점' + postfix,
              typeDetail: '프랜차이즈 주점' + postfix,
              title: '잘 나가는 술집' + postfix,
              address1: '주소 1' + postfix,
              address2: '주소 2' + postfix,
              zip: '12345' + postfix,
              currentBusinessType: '주점' + postfix, // 현업종
              suggestedBusinessType: '주점' + postfix, // 추천업종
              sizeSupplyPyeong: 10 + i, // 공급면적
              sizeSupplySquareMeter: (10 + i)* 0.3,
              floor: 1 + i,
              deposit: 100000 + i, // 보증금
              premium: 1000 + i, // 권리금
              monthlyRevenue: 10000 + i,// 월수익
              description: '보이는 내용' + i, // 기본 상세 내용
              remarks: '상세에서만 보이는 내용' + i, // 비고
              priority: priority
            });

          newProp.save((err, p) => {
            console.log(p);
          });
        }
      }
    });
  }
}

module.exports = new DBSeeder();

