import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, reduce, share } from 'rxjs/operators';
import { ApiClientService, API_URI_CAMPAIGNS, API_URI_NOTIFICATIONS } from '../api-client/api-client.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private apiClientService: ApiClientService) { }

  public getNotifications(): Observable<Record<string, any>[]> {
    return this.apiClientService.get(API_URI_CAMPAIGNS + `?user_in=${this.apiClientService.decryptTokenService.userId}`).pipe(
      map(campaigns => campaigns.map(campaign => campaign.id) as Record<string, any>[]),
      reduce((finalAcc, campaignIds: Record<string, any>[]) => finalAcc += campaignIds.reduce((acc, campaignId, idx) => acc += (idx === 0 ? `?idCampaign_in=${campaignId}` : `&idCampaign_in=${campaignId}`), ''), ''),
      switchMap(urlCampaignIds => this.apiClientService.get(API_URI_NOTIFICATIONS + urlCampaignIds)),
      map(notifications => notifications.filter(notif => notif.status === false)),
    );
  }
}
