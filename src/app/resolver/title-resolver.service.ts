import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CommonService } from '../services/common.service';
import { CampaignListService } from '../modules/pages/campaign-list/campaign-list.service';

@Injectable({
  providedIn: 'root'
})
export class TitleResolverService implements Resolve<any>
{

  campaignDetails: any;

  constructor(private commonService: CommonService,
    private campaignListService: CampaignListService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot) {
    return route.params.name
  }

}
