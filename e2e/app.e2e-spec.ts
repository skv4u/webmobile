import { SmsPage } from './app.po';

describe('sms App', () => {
  let page: SmsPage;

  beforeEach(() => {
    page = new SmsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
