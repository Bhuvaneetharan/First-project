import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';

// DIALOG
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// SERVICE
import { NavService, UserInformationService } from '../../../../services';
import { CampaignsService } from '../../campaigns.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import { KeyPress, Patterns } from '../../../../common/shared'


// SHARES
import { SnackBar } from '../../../../common/shared';
import { Location } from '@angular/common';
import { PriviewComponent } from '../../../../common/shared/dialogs/priview/priview.component'

// ROUTER
import { Router , ActivatedRoute} from '@angular/router';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@Component({
  selector: 'app-add-campaigns',
  templateUrl: './add-campaigns.component.html',
  styleUrls: ['./add-campaigns.component.scss']
})
export class AddCampaignsComponent implements OnInit, OnDestroy {

  // Step 1
  selectCampaignFor: string = "Future";
  campaignName: string = "";
  campaignId: any;

  // Step 2
  selectChannelSettings: string = '';
  previousStart: any = '';
  previousEnd: any = '';
  previousStartMax: any;
  previousEndMax: any;
  purposeSelect: string = '';
  productsList: any;
  displayedColumnsOrder: string[] = ['select', 'orderID', 'asin', 'sku', 'orderedDate', 'orderedStatus'];
  dataSourceOrder = new MatTableDataSource();
  displayedColumnsAsin: string[] = ['select', 'image', 'title', 'asin', 'sku'];
  dataSourceAsin = new MatTableDataSource();
  searchValue: any = null;
  pageNo: number;
  productCount: any;
  selectedProductCount: any = 0;

  // Step 3
  createTemplate: FormGroup;
  orderIs: any = ["Ordered", "Shipped", "Return"];
  chooseDays: any = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30']
  times: any = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  timeset: any = ["AM", "PM"]

  // Step 4
  displayedColumnspre: string[] = ['position', 'tempName', 'tempSubject', 'orderStatus', 'triggerdate', 'triggertime', 'meridiem', 'priview'];
  dataSourcepre = new MatTableDataSource();
  htmlStr:any;

  //stepper
  isLinear = false;

  // Pagenation
  pageSizeOptions: number[] = [20];
  selectedTempName: any;
  selectedTempSubject: any;
  selectedTemplate: any;
  testing: any;

  constructor(public fb: FormBuilder, public keypress: KeyPress, private _formBuilder: FormBuilder, private location: Location, private datePipe: DatePipe, public userService: UserInformationService, public router: Router, public snackbars: SnackBar, public dialog: MatDialog, public navService: NavService, private campaignService: CampaignsService, public translate: TranslateService,public route: ActivatedRoute) {
    this.navService.show();
    this.campaignId = this.route.snapshot.queryParamMap.get('id')
  }
  ngOnInit() {
    console.log(this.campaignId)
    // DELIVERY SETTINGS FORMGROUP
    this.createTemplate = new FormGroup({
      tempArray: new FormArray([
        new FormGroup({
          'option': new FormControl("", Validators.required),
          'orderis': new FormControl("", Validators.required),
          'days': new FormControl("", Validators.required),
          'timer': new FormControl("", Validators.required),
          'meridiem': new FormControl("", Validators.required),
          'templateid': new FormControl('', Validators.required),
          'template': new FormControl('', Validators.required),
          'templatesubject': new FormControl('', Validators.required),
          'templatename': new FormControl('', Validators.required),
          'predesigntemp': new FormControl('', Validators.required)
        })
      ])
    });
    this.edit_check()
  }
  edit_check(){
    if(this.campaignId!=null){
      this.campaignService.campEdit(this.campaignId).subscribe(res =>{
        // console.log(res)
        // this.campaignValues = res;
  
        this.campaignName = res["campaign"]["campaign_name"];
        this.selectCampaignFor = res["campaign"]["campaign_purpose"];
        this.selectChannelSettings = res["campaign"]["campaign_channels"];
        this.selectedTemplate = res["campaign"]["template_data"];
        this.previousStart = res["campaign"]["ordered_days_start"];
        this.previousEnd = res["campaign"]["ordered_days_end"];
        this.purposeSelect = res["campaign"]["promotion_type"];
        this.formArr.removeAt(0);
        // this.selectedTemplate = this.selectedTemplate.map(result => ({
        //   'template_subject': result["template_subject"],
        //   'mail_trigger_days': result["mail_trigger_days"],
        //   'mail_trigger_on': result["mail_trigger_on"],
        //   'id': result["id"]
        // }))

        // let data2 = res["campaign"]["template"][0]
        // data2 = JSON.parse(data2)
        // console.log(data2)
        console.log(res["campaign"]["template"])
        for(let i = 0; i < this.selectedTemplate.length; i++){
            let temp = this.createTemplate.get('tempArray') as FormArray;
            temp.push(new FormGroup({
              'option': new FormControl(this.selectedTemplate[i]['option'], Validators.required),
              'orderis': new FormControl(this.selectedTemplate[i]['orderis'], Validators.required),
              'days': new FormControl(this.selectedTemplate[i]['days'], Validators.required),
              'timer': new FormControl(this.selectedTemplate[i]['timer'], Validators.required),
              'meridiem': new FormControl(this.selectedTemplate[i]['meridiem'], Validators.required),
              'templateid': new FormControl(this.selectedTemplate[i]['templateid'], Validators.required),
              'template': new FormControl(this.selectedTemplate[i]['template'], Validators.required),
              'templatesubject': new FormControl(this.selectedTemplate[i]['templatesubject'], Validators.required),
              'templatename': new FormControl(this.selectedTemplate[i]['templatename'], Validators.required),
              'predesigntemp': new FormControl(this.selectedTemplate[i]['predesigntemp'], Validators.required)
            }))
          
          // this.createTemplate.patchValue({
          //   tempArray: new FormArray([
          //     new FormGroup({
          //       'option': new FormControl(this.selectedTemplate[i]['option'], Validators.required)
          //     })
          //   ])
          // })
        //   this.createTemplate.controls['tempArray']['value'][i].push(this.fb.group({
        //     'option': new FormControl("test", Validators.required),
        //       'orderis': new FormControl("test", Validators.required),
        //       'days': new FormControl("", Validators.required),
        //       'timer': new FormControl("", Validators.required),
        //       'meridiem': new FormControl("", Validators.required),
        //       'templateid': new FormControl('', Validators.required),
        //       'template': new FormControl('', Validators.required),
        //       'templatesubject': new FormControl('', Validators.required),
        //       'templatename': new FormControl('', Validators.required),
        //       'predesigntemp': new FormControl('', Validators.required)
        // }))
          // this.createTemplate['value']['tempArray'][i]['option'] = this.selectedTemplate[i]['option']
            console.log(this.createTemplate['value']['tempArray'][i]['option'])
        }
        // console.log(this.createTemplate)
  
        // this.campaignService.campcount(this.campaignId, this.purposeSelect).subscribe(res =>{
        //   this.count = res["count"]
        // })
        this.ordersPage();
      })
    }
  }
  // Choose Type of Campaign (Future or previous)
  campaignType(type) {
    this.selectCampaignFor = type;
    this.previousStart = "";
    this.previousEnd = "";
    this.productsList = '';
    this.selectedProductCount = 0;
  }
  // TO CHECK UNIQUE CAMPAIGN NAME
  campUnique(event) {
    this.campaignService.campaignUnique(event["target"]["value"]).subscribe(res => {
      if (res["key"] == false) {
        this.campaignId = null;
        this.campaignName = "";
      }
    })
  }

  //FIRST CHARACTER AS SPACE NOT ALLOWED
  firstNoSpace(e){
    if (e.keyCode == 32 && !this.campaignName){  
      e.preventDefault();
    }else{
      this.testing = e['srcElement']['value']
    }
  }


  // TO SELECT THE CHANNEL
  channelSetting(event) {
    this.selectChannelSettings = event.value;
    this.ordersPage();
  }
  // SHIPPED OR RETURN
  purpose(event) {
    this.purposeSelect = event.value;
    this.ordersPage();
  }
  // Date Picker (Start Date)
  previousStartDatePicker() {
    this.previousEnd = "";
    this.previousStart = this.datePipe.transform(this.previousStart, 'yyyy-MM-dd');
    const myDate = moment(this.previousStart, 'YYYY-MM-DD');
    const vals = myDate.add(30, 'days');
    const setPreviousMaxDate = this.datePipe.transform(vals, 'yyyy-MM-dd');
    var dateOne = new Date();
    var dateTwo = new Date(setPreviousMaxDate);
    if (dateOne <= dateTwo) {
      this.previousEndMax = this.previousStartMax
    } else {
      this.previousEndMax = new Date(setPreviousMaxDate);
    }
  }
  // Date Picker (End Date)
  previousEndDatePicker() {
    this.previousEnd = this.datePipe.transform(this.previousEnd, 'yyyy-MM-dd');
    if(this.purposeSelect != ''){
     this.orderstable()
    }
  }
  //campaign count
  campcount(){
    this.campaignService.campcount(this.campaignId, this.purposeSelect, this.searchValue).subscribe(res => {
      this.selectedProductCount = res["count"]
    })
  }
  //Orders table data
  orderstable(){
    this.campaignService.ordersTableData(this.pageNo, this.campaignId, this.selectChannelSettings, this.searchValue, this.purposeSelect).subscribe(res => {
      this.productsList = res["data"];
      this.productCount = res["total_asin_count"];
      if (this.selectCampaignFor == 'Future') {
        this.dataSourceAsin = new MatTableDataSource(this.productsList)
      } else {
        this.dataSourceOrder = new MatTableDataSource(this.productsList)
      }
    })
  }
  // SELECT ORDER ID/ASIN 
  ordersPage() {
    this.pageNo = 1;
    if (this.selectCampaignFor == 'Previous' && this.selectChannelSettings != "" && this.previousStart != "" && this.previousEnd != "" && this.purposeSelect != "" || this.selectCampaignFor == 'Future' && this.selectChannelSettings != "" && this.purposeSelect != "") {
      let campaignDetails = { 'status': this.purposeSelect, 'campaign_name': this.campaignName, 'campaign_purpose': this.selectCampaignFor, 'campaign_channels': this.selectChannelSettings, 'start_date': this.previousStart, 'end_date': this.previousEnd, 'campId': this.campaignId };
      this.campaignService.createCampaign(campaignDetails).subscribe(res => {
        this.campaignId = res["id"];
        this.campcount()
        this.orderstable()
      })
    }
  }
  //SELECTING ORDER ID/ASINS INDIVIDUALLY
  SelectedAsins(event, orderID) {
    if (event["checked"] == true) {
      this.campaignService.push(orderID, this.campaignId).subscribe(res => {
        this.campcount()
      })
    } else if (event["checked"] == false) {
      this.campaignService.pop(orderID, this.campaignId).subscribe(res => {
        this.campcount()
      })
    }
  }
  // ENABLE ALL/DISABLE ALL
  enableAll(event) {
    if (event["checked"]) {
      this.campaignService.enableAll(this.campaignId, this.purposeSelect, this.searchValue).subscribe(res => {
        if (res) {
          this.selectedProductCount = res["count"];
          this.campcount()
          this.orderstable()
        }
      })
    } else {
      this.campaignService.disableAll(this.campaignId, this.purposeSelect, this.searchValue).subscribe(res => {
        if (res) {
          this.selectedProductCount = res["count"];
          this.campcount()
          this.orderstable()
        }
      })
    }
  }
  // Set Preview Table
  preview() {
    this.dataSourcepre = new MatTableDataSource(this.createTemplate['value']['tempArray']);
  }
  priviewTemplate(template){
    this.htmlStr = template;
    const dialogRef = this.dialog.open(PriviewComponent, {
      width: '600px',
      height: '900px',
      data: {id: this.htmlStr}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  // PAGINATION
  pagination(event) {
    this.pageNo = event.pageIndex + 1;
    this.orderstable()
  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }
  // submit Campaign
  submitCampaing() {
    let data = { 'flag': true, 'id': this.campaignId, 'campaign_name': this.campaignName, 'campaign_channel': this.selectChannelSettings,'campaign_purpose': this.selectCampaignFor, 'templates': this.createTemplate['value']['tempArray'] }
    this.campaignService.updateCampaign(data).subscribe(res => {
      if (res["key"] == true) {
        // this.snackbars.snackbars(res['type'],'campaign created successfully')
        // this.campaignService.previousSchedule(this.campaignId, this.subjectName).subscribe();
        this.campaignId = null
        this.router.navigate(['campaigns/campaign/listcampaigns']);
      }
    })
  }
  // Templates List Dialog
  openDialog(index, name) {
    if (this.createTemplate['value']['tempArray'][index]['option'] != name) {
      this.createTemplate['controls']['tempArray']['controls'][index].reset()
    }
    this.createTemplate['value']['tempArray'][index]['option'] = name;
    const dialogRef = this.dialog.open(Ckeditor, {
      data: {
        tempType: this.createTemplate['value']['tempArray'][index]['option'],
        campId: this.campaignId,
        templatename: this.createTemplate['value']['tempArray'][index]['templatename'],
        templatesubject: this.createTemplate['value']['tempArray'][index]['templatesubject'],
        template: this.createTemplate['value']['tempArray'][index]['template'],
        templateid: this.createTemplate['value']['tempArray'][index]['templateid'],
        predesigntemp: this.createTemplate['value']['tempArray'][index]['predesigntemp']
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      // this.selectedTempName = result['name']
      // this.selectedTempSubject = result['subject']
      // this.selectedTemplate = result['template']
      this.createTemplate['controls']['tempArray']['controls'][index].patchValue({
        'templatename': result['name'],
        'templatesubject': result['subject'],
        'template': result['template'],
        'templateid': result['templateid'],
        'predesigntemp': result['predesigntemp'],
      })

    });
  }
  // priview(){
  //   this.htmlStr = this.selectedTemplate;
  //   const dialogRef = this.dialog.open(PriviewComponent, {
  //     width: '600px',
  //     height: '900px',
  //     data: {id: this.htmlStr}
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //   });
  // }
  // Dynamic Template
  addElement() {
   
    let temp = this.createTemplate.get('tempArray') as FormArray;
    temp.push(new FormGroup({
      'option': new FormControl("", Validators.required),
      'orderis': new FormControl("", Validators.required),
      'days': new FormControl("", Validators.required),
      'timer': new FormControl("", Validators.required),
      'meridiem': new FormControl("", Validators.required),
      'templateid': new FormControl('', Validators.required),
      'template': new FormControl('', Validators.required),
      'templatesubject': new FormControl('', Validators.required),
      'templatename': new FormControl('', Validators.required),
      'predesigntemp': new FormControl('', Validators.required)
    }))
  }
  get formArr() {
    return this.createTemplate.get('tempArray') as FormArray;
  }
  // Remove Template
  removeElement(index) {
    this.formArr.removeAt(index);
  }
  ngOnDestroy() {
    if (this.campaignId != null) {
      this.userService.campDelete(this.campaignId, "dont_delete").subscribe()
    }
  }
}


@Component({
  selector: 'ckeditorcamp',
  templateUrl: 'ckeditor.html',
  styleUrls: ['./add-campaigns.component.scss']
})
export class Ckeditor {
  ckeConfig: any;
  templateName: any = "";
  htmlContent: any = "";
  subjectName: any = "";
  templateDetails: Object;
  pageNo: any = 1;
  templates: any;
  id: any;
  pretemplate: any = "";

  constructor(public dialogRef: MatDialogRef<Ckeditor>,@Inject(MAT_DIALOG_DATA) public data, private campaignService: CampaignsService, public snackbars: SnackBar) { }
  ngOnInit() {
    //CK EDITOR
    this.ckeConfig = {
      // height: 200,
      // width: 600,
      uiColor: "#ebebeb",
      language: "en",
      allowedContent: true,
      fullPage: true,
      toolbar: [
        { name: "documenthandling", items: ["imageExplorer"] },
        { name: 'document', groups: ['mode', 'document', 'doctools'], items: ['Source', '-', '-'] },
        { name: "insert", items: ["Image"] },
        { name: "basicstyles", items: ["Bold", "Italic", "Underline", "Strike"] },
        { name: 'clipboard', groups: ['clipboard', 'undo'], items: ['Undo', 'Redo'] },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'], items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
        { name: 'links', items: ['Link', 'Unlink'] },
        { name: "styles", items: ["Styles", "Format", "FontSize", "-", "TextColor", "BGColor", "Font"] },
      ],
      extraPlugins: 'justify,font,colorbutton,panelbutton,link',
    };
    this.ckeConfig.removePlugins = 'resize';
    // Show Selected Template
    if (this.data['template']) {
      this.templateName = this.data['templatename']
      this.subjectName = this.data['templatesubject'];
      this.htmlContent = this.data['template'];
      this.id = this.data['templateid'],
        this.pretemplate = this.data['predesigntemp']
    }
    // Template List
    if (this.data['campId'] != null && this.data['tempType'] != "") {
      this.campaignService.temp_list(this.pageNo, this.data['tempType'], this.data['campId']).subscribe(res => {
        this.templates = res['template']
      })
    }
  }
  //SET TEMPLATE TYPE
  setTemplateType(data) {
    this.templateName = ''
    this.subjectName = ''
    this.id = data;
    if (data != 'new') {
      this.campaignService.tempDetails(data).subscribe(res => {
        this.templateName = res['template_name']
        this.subjectName = res['template_subject'];
        this.htmlContent = res['template_content'];
      })
    }
  }
  // Selected Tamplate
  submit() {
    let data = {
      'name': this.templateName,
      'subject': this.subjectName,
      'template': this.htmlContent,
      'templateid': this.id,
      'predesigntemp': this.pretemplate,
        }
    if (this.id != 'new') {
      this.dialogRef.close(data);
    } else {
      // API And Close
      let sendTempData = {
        'template_name': this.templateName,
        'template_purpose': this.data['tempType'],
        'template_subject': this.subjectName,
        'template_content': this.htmlContent,
      }
      this.campaignService.sendTemplateData(sendTempData).subscribe(res => {
        if (res["key"] == true) {
          this.dialogRef.close(data);
        }
      })
    }
  }
}