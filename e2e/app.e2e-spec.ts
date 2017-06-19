import { LcsRealEstatePage } from './app.po';

describe('lcs-real-estate App', () => {
  let page: LcsRealEstatePage;

  beforeEach(() => {
    page = new LcsRealEstatePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
