const assert = require('node:assert');
const { Web3 } = require('web3');
const ganache = require('ganache');
const {
  evm: {
    bytecode: { object: bytecode },
  },
  abi,
} = require('../compile');

const web3 = new Web3(ganache.provider());

describe('Inbox', () => {
  const INITIAL_STRING = 'Hello, World!';
  let accounts;
  let inbox;

  beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    inbox = await new web3.eth.Contract(abi)
      .deploy({ data: bytecode, arguments: [INITIAL_STRING] })
      .send({ from: accounts[0], gas: '1000000' });
  });

  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.strictEqual(message, INITIAL_STRING);
  });

  it('can change the message', async () => {
    await inbox.methods.setMessage('Bye, World!').send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.strictEqual(message, 'Bye, World!');
  });
});
