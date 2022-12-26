import {isUserInAuthWhiteList} from "./auth";

const mockedUserList:string = "maxime.delannoy@gmail.com"

it('should return true if an email of the mocked user list is on the .env white list', function () {
    expect(isUserInAuthWhiteList(mockedUserList)).toEqual(true);
});

