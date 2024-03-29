// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";

contract Control is Ownable, AccessControl{

    //----Variables

    uint balanceOfContract;
    mapping (address => UserStruct) private usersAll;
    address[] private organizationAccounts;
    address[] private userAccounts;
    address[] private doctorAccounts;
    OwnerStruct private ownerdetails;
    uint private indexUser;
    uint private indexDoctor;
    uint private indexOrganization;
    uint private indexCard;
    uint private indexPermission;
    bool private status;
    bytes32 public constant USER_ROLE = keccak256("USER_ROLE");
    bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");
    bytes32 public constant ORGANIZATION_ROLE = keccak256("ORGANIZATION_ROLE");

    //----Structs

    struct OwnerStruct{
        address ownerAddress;
        string organizationName;
        uint dateCreated;
    }

    struct UserStruct{
        string userName;
        string userSurname;
        uint128 userAge;
        uint userSince;
        uint userIndex;
        string userRole;
        Card userCard;
    }


    struct Card{
        string jsonHash;
        uint lastUpdate;
        bool encrypted;
    }

    //----Events

    event UserAdded(address indexed from, address userAddress, string userName, string userSurname, Card userCard, string userRole, uint256 timestamp);
    event UserRemoved(address indexed from, address userAddress, string userName, string userSurname);
    event CardUpdated(address indexed from, address indexed to, string previousHash, string newHash);
    event AskForPermission(address from, address indexed to, uint permissionId, string name, string surname, uint indexed when);
    event RejectPermission(address from, address to, uint indexed permissionId, string message, uint when);
    event GiveInformation(address indexed from, address indexed to, uint indexed permissionId, uint when);
//    event DoctorUpdate(address from, address to, uint permissionId, uint when);
    event Error(address from, address contractAddress, string cause);
    event Encrypted(address from, string message);

    //----Constructor of smart-contract

    constructor (string memory enterOrganizationName){
        ownerdetails.ownerAddress = msg.sender;
        ownerdetails.organizationName = enterOrganizationName;
        ownerdetails.dateCreated = block.timestamp;
        indexUser = 0;
        indexDoctor = 0;
        status = true;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ORGANIZATION_ROLE, msg.sender);
    }

    //----Handling empty or invalid transactions

    fallback() external payable{
        emit Error(msg.sender, address(this), "Function name error");
        balanceOfContract += msg.value;
    }

    receive() external payable{
        balanceOfContract += msg.value;
    }

    //----Modifiers

    modifier contractActive {
        require(status == true, "Smart contract is not active");
        _;
    }

    modifier onlyRoles2(bytes32[2] memory roles) {

        bool flag;
        flag = false;

        for(uint i = 0; i < roles.length; i++){
            if(hasRole(roles[i],msg.sender) == true){
                flag = true;
            }
        }
        require(flag == true, "Account doesn't have any of these roles");
        _;
    }

    modifier onlyRoles3(bytes32[3] memory roles) {

        bool flag;
        flag = false;

        for(uint i = 0; i < roles.length; i++){
            if(hasRole(roles[i],msg.sender) == true){
                flag = true;
            }
        }
        require(flag == true, "Account doesn't have any of these roles");
        _;
    }

    //----Utility functions

    //------Function to compare two strings

    function compare(string memory str1, string memory str2) internal pure returns (bool) {
        if (bytes(str1).length != bytes(str2).length) {
            return false;
        }
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }

    //------Function to concatenate two arrays

    function ConcatenateArrays(address[] memory Accounts, address[] memory Accounts2) internal pure returns(address[] memory) {

        address[] memory returnArr = new address[](Accounts.length + Accounts2.length);

        uint i=0;
        for (; i < Accounts.length; i++) {
            returnArr[i] = Accounts[i];
        }

        uint j=0;
        while (j < Accounts2.length) {
            returnArr[i++] = Accounts2[j++];
        }

        return returnArr;
    }

    //----Functions that are called with "transaction"


    //----Add user function

    function addUser(address _userAddress, string memory _userName, string memory _userSurname, uint128 _userAge, string memory _userRole, Card memory _userCard) public onlyRoles2([DOCTOR_ROLE, ORGANIZATION_ROLE]) contractActive{

        require(usersAll[_userAddress].userSince == 0, "User already exists");

        if(compare(_userRole,"USER")){
            usersAll[_userAddress] = UserStruct({
            userName: _userName,
            userSurname: _userSurname,
            userAge: _userAge,
            userIndex: indexUser,
            userRole: _userRole,
            userSince: block.timestamp,
            userCard: _userCard
            });
            userAccounts.push(_userAddress);
            indexUser++;
            _setupRole(USER_ROLE, _userAddress);
        }else if(compare(_userRole, "DOCTOR")){
            usersAll[_userAddress] = UserStruct({
            userName: _userName,
            userSurname: _userSurname,
            userAge: _userAge,
            userIndex: indexDoctor,
            userRole: _userRole,
            userSince: block.timestamp,
            userCard: _userCard
            });
            doctorAccounts.push(_userAddress);
            indexDoctor++;
            _setupRole(DOCTOR_ROLE, _userAddress);
        }else{
            usersAll[_userAddress] = UserStruct({
            userName: _userName,
            userSurname: _userSurname,
            userAge: _userAge,
            userIndex: indexOrganization,
            userRole: _userRole,
            userSince: block.timestamp,
            userCard: _userCard
            });
            organizationAccounts.push(_userAddress);
            indexOrganization++;
            _setupRole(ORGANIZATION_ROLE, _userAddress);
        }

        emit UserAdded(msg.sender, _userAddress, _userName, _userSurname,_userCard, _userRole, block.timestamp);
    }


    function removeUser(address _userAddress) public onlyOwner contractActive{

        require(usersAll[_userAddress].userSince != 0, "User does not exist");
        string memory role = usersAll[_userAddress].userRole;

        if(compare(role,"USER")){
            delete userAccounts[usersAll[_userAddress].userIndex];
            userAccounts[usersAll[_userAddress].userIndex] = userAccounts[userAccounts.length - 1];
            UserStruct storage user = usersAll[userAccounts[usersAll[_userAddress].userIndex]];
            user.userIndex = usersAll[_userAddress].userIndex;
            userAccounts.pop();
            delete usersAll[_userAddress];

            indexUser--;
            revokeRole(USER_ROLE, _userAddress);
        }else{
            delete doctorAccounts[usersAll[_userAddress].userIndex];
            doctorAccounts[usersAll[_userAddress].userIndex] = doctorAccounts[doctorAccounts.length - 1];
            UserStruct storage user = usersAll[doctorAccounts[usersAll[_userAddress].userIndex]];
            user.userIndex = usersAll[_userAddress].userIndex;
            doctorAccounts.pop();
            delete usersAll[_userAddress];

            indexDoctor--;
            revokeRole(DOCTOR_ROLE, _userAddress);
        }

        emit UserRemoved(msg.sender, _userAddress, usersAll[_userAddress].userName, usersAll[_userAddress].userSurname);
    }

    function askPermission(address _userAddress) public contractActive onlyRole(DOCTOR_ROLE){

        indexPermission++;

        emit AskForPermission(msg.sender, _userAddress, indexPermission, usersAll[msg.sender].userName, usersAll[msg.sender].userSurname, block.timestamp);
    }

    function giveInformation(address _userAddress, string memory typeOfAnswer, uint index) public contractActive onlyRole(USER_ROLE){


        if(compare(typeOfAnswer, "YES")){

            emit GiveInformation(msg.sender, _userAddress, index, block.timestamp);
            console.log('YES');

        }else{

            emit RejectPermission(msg.sender, _userAddress, index, "Rejected", block.timestamp);
            console.log('NO');

        }

    }

    //DoctorUpdate event can be useful in future

//    function doctorUpdate(address _userAddress, uint permissionId) public contractActive onlyRole(DOCTOR_ROLE){
//
//        emit DoctorUpdate(msg.sender, _userAddress, permissionId, block.timestamp);
//
//    }


    function updateCard(string memory _jsonHash, address to) public contractActive onlyRoles2([USER_ROLE,DOCTOR_ROLE]) {

        emit CardUpdated(msg.sender,to,usersAll[msg.sender].userCard.jsonHash, _jsonHash);

        usersAll[to].userCard.jsonHash = _jsonHash;
    }

    function encrypt(string memory message) public contractActive onlyRoles2([USER_ROLE,DOCTOR_ROLE]) {

        emit Encrypted(msg.sender, message);

        usersAll[msg.sender].userCard.encrypted = true;

    }


    function changeStatus(bool _status) public onlyOwner {
        status = _status;
    }
    //----Functions that are called with "call"

    function getOwner() public view returns (address ownerAddress, string memory organizationName, uint dateCreated){
        return(ownerdetails.ownerAddress, ownerdetails.organizationName, ownerdetails.dateCreated);
    }

    function getAllUsers() public onlyRoles2([DOCTOR_ROLE, ORGANIZATION_ROLE]) view returns (address[] memory){
        return ConcatenateArrays(userAccounts, doctorAccounts);
    }

    function getFullUsers() public onlyRoles2([DOCTOR_ROLE, ORGANIZATION_ROLE]) view returns (UserStruct[] memory){

        UserStruct[] memory users = new UserStruct[](userAccounts.length);

        for (uint i = 0; i< userAccounts.length; i++){
            users[i] = usersAll[userAccounts[i]];
        }

        return users;
    }

    function getFullDoctors() public onlyRoles3([USER_ROLE,DOCTOR_ROLE,ORGANIZATION_ROLE]) view returns (UserStruct[] memory){

        UserStruct[] memory doctors = new UserStruct[](doctorAccounts.length);

        for (uint i = 0; i< doctorAccounts.length; i++){
            doctors[i] = usersAll[doctorAccounts[i]];
        }

        return doctors;
    }

    function getFullOrgs() public onlyRoles3([USER_ROLE, DOCTOR_ROLE, ORGANIZATION_ROLE]) view returns (UserStruct[] memory){

        UserStruct[] memory orgs = new UserStruct[](organizationAccounts.length);

        for (uint i = 0; i< organizationAccounts.length; i++){
            orgs[i] = usersAll[organizationAccounts[i]];
        }

        return orgs;
    }

    function getSpecificUser(address userAddress) public onlyRoles2([DOCTOR_ROLE, ORGANIZATION_ROLE]) view returns (UserStruct memory){
        return usersAll[userAddress];
    }

    function getOnlyUsers() public onlyRoles2([DOCTOR_ROLE, ORGANIZATION_ROLE]) view returns (address[] memory){
        return userAccounts;
    }

    function getOnlyDoctors() public onlyRoles3([DOCTOR_ROLE, USER_ROLE, ORGANIZATION_ROLE]) view returns (address[] memory){
        return doctorAccounts;
    }

    function getOnlyOrgs() public onlyRoles3([DOCTOR_ROLE, USER_ROLE, ORGANIZATION_ROLE]) view returns (address[] memory){
        return organizationAccounts;
    }

    function getNoOfUsers() public onlyRoles2([DOCTOR_ROLE, ORGANIZATION_ROLE]) view returns (uint){
        return userAccounts.length;
    }

    function getNoOfDoctors() public onlyRoles3([DOCTOR_ROLE, USER_ROLE, ORGANIZATION_ROLE]) view returns (uint){
        return doctorAccounts.length;
    }
}