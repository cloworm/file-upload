public with sharing class GetSite {
  @AuraEnabled(cacheable=true)
  public static String getSiteUrl() {
    return Site.getPathPrefix();
  }
}
