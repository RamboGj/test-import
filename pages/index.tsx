import { ethers } from "ethers"
import { useEffect, useState } from "react"
import abi from '../abi.json'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [contractAddressToAdd, setContractAddressToAdd] = useState<string>('')

  const contractAbi = abi
  const contractAddress = "0x7c487845f98938Bb955B1D5AD069d9a30e4131fd"

  async function handleConnectMetamask() {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)

        await provider.send("eth_requestAccounts", [])

        const signer = provider.getSigner()
        const address = await signer.getAddress()

        console.log(address)
        if (signer) {
          setIsAuthenticated(true)
        }
      }


    } catch (error) {
      console.log("Erro ao autenticar")
    }
  }

  async function addContractToPanel(contractToAddAddress: string, address: string) {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)

        const signer = provider.getSigner()

        const contract = new ethers.Contract(contractAddress, contractAbi, signer)
        
        await contract.add(address, contractToAddAddress)
        
        console.log('contrato: ', contract)
      
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      console.log("OK!")
    } else {
      alert("Please install metamask!")
    }
  }, [])

  return (
    <>
    {isAuthenticated ? (
      <div className="flex-col mx-auto mt-24 max-w-screen justify-center">
        <h1 className="text-3xl font-bold">Import contracts</h1>
          <div className="block">
            <label htmlFor="">Contrato que deseja adicionar</label>
            <input 
              value={contractAddressToAdd} 
              onChange={(e) => setContractAddressToAdd(e.target.value)}
              type="text" 
              className="w-full h-full rounded-md max-w-[350px] py-3 px-6 bg-gray-200 hover:bg-gray-300 focus:bg-gray-300 transition duration-500" 
              placeholder="0x9321odask..." 
            />
            <label htmlFor="">Endereço da sua carteira</label>
            <input 
              value={walletAddress} 
              onChange={(e) => setWalletAddress(e.target.value)}
              type="text" 
              className="w-full h-full rounded-md max-w-[350px] py-3 px-6 bg-gray-200 hover:bg-gray-300 focus:bg-gray-300 transition duration-500" 
              placeholder="0x9321odask..." 
            />
          </div>
      
          <button 
            onClick={() => addContractToPanel(walletAddress, contractAddressToAdd)}
            type="button"
            className="bg-yellow-500 py-3 px-6 rounded-md mt-12 text-white font-bold">
              Import Contracts
          </button>
        
      </div>
    ) : (
      <div className="flex-col mx-auto mt-24 max-w-screen justify-center">
        <button 
          onClick={handleConnectMetamask}
          className="bg-yellow-500 py-3 px-6 rounded-md mt-12 text-white font-bold">
            Connect Wallet
        </button>
      </div>
    )}
    </>
  )
}