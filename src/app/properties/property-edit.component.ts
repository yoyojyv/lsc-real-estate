import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PropertyService} from '../core/property.service';
import {AuthService} from '../core/auth.service';
import {IProperty} from '../shared/interfaces';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../core/alert.service';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

@Component({
  selector: 'property-edit',
  templateUrl: 'property-edit.component.html'

})
export class PropertyEditComponent implements OnInit {

  currentUserInfo: any;

  property: IProperty;

  daumAddressOptions =  {
    class: ['btn', 'btn-primary']
  };

  trySubmit: boolean = false;

  propertyForm: FormGroup;

  validationMessages = {
    status: {
      'required': '진행상태를 선택해주세요.',
    },
    type: {
      'required': '대분류를 선택해주세요.',
    },
    typeDetail: {
      'required': '상세분류를 입력해주세요.',
    },
    title: {
      'required': '매물이름을 입력해주세요.',
    },
    address1: {
      'required': '주소를 입력해주세요. (우편번호 찾기 버튼 이용)',
    },
    address2: {
      'required': '주소2를 입력해주세요.',
    },
    currentBusinessType: {
      'required': '현업종을 입력해주세요.',
    },
    suggestedBusinessType: {
      'required': '추천업종을 입력해주세요.',
    },
    sizeSupplyPyeong: {
      'required': '공급면적(평)을 입력해주세요.',
    },
    sizeSupplySquareMeter: {
      'required': '공급면적(평)을 입력해주세요.',
    },
    floor: {
      'required': '층을 입력해주세요.',
    },
    deposit: {
      'required': '보증금을 입력해주세요.',
    },
    premium: {
      'required': '권리금을 입력해주세요.',
    },
    monthlyRevenue: {
      'required': '월수익을 입력해주세요.',
    },
    monthlyRent: {
      'required': '월세를 입력해주세요.',
    },
    description: {
      'required': 'Description 을 입력해주세요.'
    },
    remarks: {
      'required': '비고를 입력해주세요.'
    },
    priority: {
      'required': '우선순위를 선택해주세요.'
    }
  };

  formErrors = {
    'status': [],
    'type': [],
    'typeDetail': [],
    'title': [],
    'address1': [],
    'address2': [],
    'currentBusinessType': [],
    'suggestedBusinessType': [],
    'sizeSupplyPyeong': [],
    'sizeSupplySquareMeter': [],
    'floor': [],
    'deposit': [],
    'premium': [],
    'monthlyRevenue': [],
    'monthlyRent': [],
    'description': [],
    'remarks': [],
    'priority': [],
  };

  constructor(private router: Router, private route: ActivatedRoute,
              private propertyService: PropertyService,
              private authService: AuthService, private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.initFormGroup();

    const id:string = this.route.snapshot.params['id'];
    if (id != null) {
      // edit
      this.propertyService.getPropertyDetail(id)
        .subscribe(
          (property: IProperty) => {
            this.property = property;
            for (let p in property) {
              let oneProp = this.propertyForm.controls[p];
              if (oneProp) {
                oneProp.setValue(property[p]);
              }
            }
          },
          (err: any) => {
            if (err.toString().indexOf('No JWT present or') > -1) {
              this.router.navigate(['login']);
            } else {
              this.alertService.error(err);
            }
          }
        );

    } else {
      // new
      this.property = <IProperty>{personInCharge: this.authService.getCurrentUserId()};
    }
  }

  onValueChanged(data?: any) {
    if (!this.propertyForm) {
      return;
    }
    const form = this.propertyForm;

    for (const field in this.propertyForm.controls) {

      // clear previous error message
      this.formErrors[field] = [];

      if (field !== 'status') {
        this.propertyForm[field] = '';
      }

      let control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          // if (messages[key])
          this.formErrors[field].push(messages[key]);
        }
      }

    }
  }


  setDaumAddressApi(data){
    // 여기로 주소값이 반환
    // {zip: "420-847", addr: "경기 부천시 중동 1029-4", addrEng: "1029-4, Jung-dong, Bucheon-si, Gyeonggi-do, Korea"}
    if (data.addr) {
      this.propertyForm.controls['address1'].setValue(data.addr);
      this.propertyForm.controls['zip'].setValue(data.zip);
    }
  }

  changeSizeSupply(type) {
    if (type === 'sizeSupplyPyeong') {
      let toSquareMeter = Math.floor(this.propertyForm.controls['sizeSupplyPyeong'].value * 3.3) || null;
      this.propertyForm.controls['sizeSupplySquareMeter'].setValue(toSquareMeter);
    } else if (type === 'sizeSupplySquareMeter') {
      let toPyeong = this.propertyForm.controls['sizeSupplySquareMeter'].value * 0.30258 || null;
      this.propertyForm.controls['sizeSupplyPyeong'].setValue(toPyeong);
    }
  }

  changeAmount() {
    let sum = +(this.propertyForm.controls['deposit'].value) + +(this.propertyForm.controls['premium'].value);
    this.propertyForm.controls['sumDepositAndPremium'].setValue(sum);
  }

  back() {
    history.back();
  }

  saveProperty() {

    this.trySubmit = true;

    if (!this.propertyForm.valid) {
      return;
    }

    this.propertyService.saveProperty(this.propertyForm.value)
      .subscribe(
        (result: any) => {
          history.back();
        },
        (err: any) => {
          if (err.toString().indexOf('No JWT present or') > -1) {
            this.router.navigate(['login']);
          } else {
            this.alertService.error(err);
          }
        }
      );
  }

  private initFormGroup() {
    this.propertyForm = new FormGroup({
      _id: new FormControl('', Validators.compose([
      ])),
      no: new FormControl('', Validators.compose([
      ])),
      zip: new FormControl('', Validators.compose([
      ])),
      status: new FormControl('in_progress', Validators.compose([
        Validators.required,
      ])),
      type: new FormControl('음식점', Validators.compose([
        Validators.required,
      ])),
      typeDetail: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      title: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      address1: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      address2: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      currentBusinessType: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      suggestedBusinessType: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      sizeSupplyPyeong: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      sizeSupplySquareMeter: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      floor: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      deposit: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      premium: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      sumDepositAndPremium: new FormControl('', Validators.compose([
      ])),
      monthlyRevenue: new FormControl('', Validators.compose([
      ])),
      monthlyRent: new FormControl('', Validators.compose([
      ])),
      description: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      remarks: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      priority: new FormControl('a', Validators.compose([
        Validators.required,
      ])),
    });

    // this.propertyForm.valueChanges
    //   .debounceTime(400)
    //   .subscribe(data => this.onValueChanged(data));
    //
    // this.propertyForm.statusChanges
    //   .subscribe(data => this.onValueChanged(data));
  }
}
