/**
 * @description       : Get current site (community)
 * @author            : Chloe Echikson
 * @group             : Gerent LLC
 * @last modified on  : 03-01-2021
 * @last modified by  : Chloe Echikson
 * Modifications Log
 * Ver   Date         Author           Modification
 * 1.0   03-01-2021   Chloe Echikson   Initial Version
 **/
public with sharing class GetSite {
  /**
   * @description  Returns the URL path prefix of the current site or an empty string if none
   * @author       Chloe Echikson | 03-01-2021
   * @return       String
   **/
  @AuraEnabled(cacheable=true)
  public static String getSiteUrl() {
    return Site.getPathPrefix();
  }
}
