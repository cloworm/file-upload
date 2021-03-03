@isTest
private class GetSiteTest {
  @isTest
  static void testGetSite() {
    String siteUrl = GetSite.getSiteUrl();
    System.assertEquals(siteUrl, '');
  }
}
