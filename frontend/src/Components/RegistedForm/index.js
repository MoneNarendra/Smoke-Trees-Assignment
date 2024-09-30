import { Component } from "react"
import "./index.css"

class RegistedForm extends Component {

    state = { name: "", address: "", errorMsg: "", error: false, userDetails: [], allAddress: [] }

    componentDidMount() {
        this.getAllData()
    }

    getAllData = async () => {
        const response = await fetch("https://smoke-trees-assignment-pkgh.onrender.com/data")
        const data = await response.json();
        this.setState({ userDetails: data.allUsers, allAddress: data.allAddress })
    }

    addUserDetails = async () => {
        const { name, address } = this.state
        const url = `https://smoke-trees-assignment-pkgh.onrender.com/register`;

        const userDetails = { name, address };
        const options = {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(userDetails),
        };
        await fetch(url, options);
        this.getAllData();
    }

    submitForm = (event) => {
        event.preventDefault();
        const { name, address } = this.state
        console.log(name, address)
        if (name === "" || address === "") {
            this.setState({ errorMsg: "Fill the Details", error: true })
        } else {
            this.addUserDetails()
        }
    }

    onChangeVal = (event) => {
        const { name, value } = event.target
        this.setState({ [name]: value })
    }

    getUserDetaildAddress = (users, allAddress) => {
        return users.map(eachUser => ({
            id: eachUser.id,
            name: eachUser.name,
            userAddres: allAddress.filter(eachAddress => eachAddress.userId === eachUser.id)
        }))
    }


    render() {
        const { name, address, error, errorMsg, userDetails, allAddress } = this.state
        const userDetailsAddress = this.getUserDetaildAddress(userDetails, allAddress)
        
        return (
            <>
                <h1>Address Storage</h1>
                <form onSubmit={this.submitForm}>
                    <div className="input-contianer">
                        <input type="text" placeholder="Enter Your Name" name="name" value={name} onChange={this.onChangeVal} />
                        <input type="text" placeholder="Enter Your Address" name="address" value={address} onChange={this.onChangeVal} />
                    </div>
                    <button type="submit">Add</button>
                    {error && <p className="error-msg">{errorMsg}</p>}
                </form>
                <ul>{userDetailsAddress.map(eachData =>
                    <li key={eachData.id}>
                        <h3>{eachData.name}</h3>
                        <ul>{eachData.userAddres.map(eachDetail =>
                            <li key={eachDetail.id}>{eachDetail.address}</li>)}
                        </ul>
                    </li>)}
                </ul>
            </>)
    }
}

export default RegistedForm
