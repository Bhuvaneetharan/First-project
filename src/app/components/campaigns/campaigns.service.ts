import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// ENVIRONMENT
import { environment } from 'src/environments/environment';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CampaignsService {

  constructor(private http: HttpClient) { }

  // TEMPLATES API'S
  chooseTemplate(purposeof){
    return this.http.get(environment.apiUrl+'templates/choose_template?template_purpose='+purposeof).pipe(share());
  }
  asinNoSelect(campaignId){
    return this.http.get(environment.apiUrl+'campaigns/asin_validation?id='+campaignId).pipe(share());
  }

  sent_promotion(data){
    return this.http.post(environment.apiUrl+'campaigns/create_promotion',{data}).pipe(share());
  }

  subjectContent(templateName){
    return this.http.get(environment.apiUrl+'templates/subject_content?template_name='+templateName).pipe(share());
  }

  sendTemplateData(tempData){
    return this.http.post(environment.apiUrl+'templates/create_template',tempData).pipe(share());
  }

  allTemplates(page, searchValue){
    return this.http.get(environment.apiUrl+'templates/all_templates?page='+page+'&&keyword='+searchValue).pipe(share());
  }

  deleteTemplate(tempid){
    return this.http.delete(environment.apiUrl+'templates/delete_template?id='+tempid).pipe(share());
  }

  showEditTemplate(templateId){
    return this.http.get(environment.apiUrl+'templates/template_edit?id='+templateId).pipe(share());
  }

  updateTemplate(datas){
    return this.http.post(environment.apiUrl+'templates/template_update',datas).pipe(share());
  }

  // CAMPAIGN API'S
  createCampaign(campaignDetails){
    return this.http.post(environment.apiUrl+'campaigns/create_campaign',campaignDetails).pipe(share());
  }
  
  campaignUnique(campaignName){
    return this.http.get(environment.apiUrl+'campaigns/unique_camp_name?campaign_name='+campaignName).pipe(share());
  }

  templateUnique(tempname){
    return this.http.get(environment.apiUrl+'templates/uniq_template_name?template_name='+tempname).pipe(share());
  }

  campaignTemplate(campaignId){
    return this.http.get(environment.apiUrl+'campaigns/campaign_templates?id='+campaignId).pipe(share());
  }

  updateCampaign(flags){
    return this.http.post(environment.apiUrl+'campaigns/update_campaign',flags).pipe(share());
  }

  updateCampain(flags){
    return this.http.patch(environment.apiUrl+'campaigns/campaign_update',flags).pipe(share());
  }

  listCampaign(pageNo, searchValue){
    return this.http.get(environment.apiUrl+'campaigns/campaigns?page='+pageNo+'&&keyword='+searchValue).pipe(share());
  }

  previousSchedule(campaignId,subjectname){
    return this.http.get(environment.apiUrl+'campaigns/previous_schedule?id='+campaignId+'&&subject='+subjectname).pipe(share());
  }

  campDelete(campaignId){
    return this.http.delete(environment.apiUrl+'campaigns/camp_delete?id='+campaignId).pipe(share());
  }

  campActive(campaignId){
    return this.http.get(environment.apiUrl+'campaigns/camp_enable?id='+campaignId).pipe(share());
  }

  campDeactivate(campaignId){
    return this.http.get(environment.apiUrl+'campaigns/camp_disable?id='+campaignId).pipe(share());
  }

  campEdit(campaignId){
    return this.http.get(environment.apiUrl+'campaigns/campaign_edit?id='+campaignId).pipe(share());
  }

  campExpend(campaignId){
    return this.http.get(environment.apiUrl+'campaigns/camp_expand?id='+campaignId).pipe(share());
  }
  templateList(campaignId){
    return this.http.get(environment.apiUrl+'campaigns/promotion_template?id='+campaignId).pipe(share());
  }
  
  tempPop(temp_id, camp_id){
    return this.http.get(environment.apiUrl+'campaigns/template_pop?template_id='+temp_id+'&&id='+camp_id).pipe(share());
  }

  download(){
    return this.http.get(environment.apiUrl+'inventories/download_source').pipe(share());
  }
  
  campVerify(){
    return this.http.get(environment.apiUrl+'campaigns/verify_campaign').pipe(share());
  }
  testMail(data){
    return this.http.post(environment.apiUrl+'emails/test_email',data).pipe(share());
  }

  testMailpromotion(data){
    return this.http.post(environment.apiUrl+'emails/test_promo',data).pipe(share());
  }
  restore()
  {
    return this.http.get(environment.apiUrl+'templates/restore_template').pipe(share());
  }
  upgradeplan(){
    return this.http.get(environment.apiUrl + 'plans/upgrade_plan').pipe(share());
  }
  campcount(campId, status, keyword){
    return this.http.get(environment.apiUrl+'campaigns/camp_purpose1?id='+campId+'&&status='+status+'&&keyword='+keyword).pipe(share());
  }
  //select orders table
  ordersTableData(pageNo, campId, channel, keyword, status){
    return this.http.get(environment.apiUrl+'campaigns/camp_purpose?page='+pageNo+'&&id='+campId+'&&channel='+channel+'&&keyword='+keyword+'&&status='+status).pipe(share());
  }
  promocount(campId){
    return this.http.get(environment.apiUrl+'campaigns/promotion_for?id='+campId).pipe(share());
  }
  reset(campId){
    return this.http.get(environment.apiUrl+'campaigns/campaign_reset?id='+campId).pipe(share());
  }
  camp_switch(campId){
    return this.http.get(environment.apiUrl+'campaigns/camp_switch?id='+campId).pipe(share());
  }

  templateVerify(tempId){
    return this.http.get(environment.apiUrl+'templates/template_check?id='+tempId).pipe(share());
  }
  product(pageNo, searchValue){
    return this.http.get(environment.apiUrl+'inventories/products?page='+pageNo+'&&keyword='+searchValue).pipe(share());
  }
  push(checkedvalue,campId){
    return this.http.get(environment.apiUrl+'campaigns/push?data='+checkedvalue+'&&id='+campId).pipe(share());
  }
  pop(checkedvalue,campId){
    return this.http.get(environment.apiUrl+'campaigns/pop?data='+checkedvalue+'&&id='+campId).pipe(share());
  }
  enableAll(campId, status, searchValue){
    return this.http.get(environment.apiUrl+'campaigns/enable_all?id='+campId+'&&status='+status+'&&keyword='+searchValue).pipe(share());
  }

  disableAll(campId, status,searchValue){
    return this.http.get(environment.apiUrl+'campaigns/disable_all?id='+campId+'&&status='+status+'&&keyword='+searchValue).pipe(share());
  }
  temp_list(pageNo, purposeof, camp_id){
    return this.http.get(environment.apiUrl+'campaigns/templates?template_purpose='+purposeof+'&&page='+pageNo+'&&id='+camp_id).pipe(share());
  }
  tempPush(temp_id, camp_id){
    return this.http.get(environment.apiUrl+'campaigns/template_push?template_id='+temp_id+'&&id='+camp_id).pipe(share());
  }

  tempDetails(temp_id){
    return this.http.get(environment.apiUrl+'templates/particular_temp?temp_id='+temp_id).pipe(share());
  }
  listPromotion(pageNo,searchValue){
    return this.http.get(environment.apiUrl+'campaigns/all_promotion?page='+pageNo+'&&keyword='+searchValue).pipe(share());
  }
  editPromotion(id){
    return this.http.get(environment.apiUrl+'campaigns/promo_edit?id='+id).pipe(share());
  }
  updatePromotion(id,data){
    return this.http.post(environment.apiUrl+'campaigns/promo_update',{id,data}).pipe(share());
  }
  delete_promo(id){
  return this.http.delete(environment.apiUrl+'campaigns/promo_delete?id='+id)
  }
  promo_status(){
    return this.http.get(environment.apiUrl+'campaigns/promo_status').pipe(share());
  }
  promo_retrieve(){
    return this.http.get(environment.apiUrl+'campaigns/promo_retrieve').pipe(share());
  }
}
