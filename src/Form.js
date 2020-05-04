import React from 'react';
import Select from 'react-select';
import axios from 'axios';
import ReactLoading from 'react-loading';

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZThjMmU0NTVmODAxNzUxMThjZjIxMWYiLCJuYW1lIjoiR2VuZXggRGlnaXRhbCIsImVtYWlsIjoidGFoaW5zQGdlbmV4LmRpZ2l0YWwiLCJpYXQiOjE1ODcxNDEzOTIsImV4cCI6MTYwMjY5MzM5MiwiaXNzIjoiNWU4YzJlNDU1ZjgwMTc1MTE4Y2YyMTFmIn0.Qa_B-Yj7CpOCkh6zDyKueOXn3RlOMDHL305T34GkB_k"
const baseurl = "https://dev.corona-dghs.xyz/api/"
const chatlogyBaseUrl = "https://hostchat.chatlogy.ai/"

export default class Form extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            allDivision: null,
            allDistricts: null,
            allUpazelas: null,
            selectedDivision: null,
            selectedDistrict: null,
            selectedUpazela: null,
            loading: true
        };
        console.log(this.props.match.params)
        this.fetchData()
    }

    fetchData = async () => {

        try {
            let { lang } = this.props.match.params

            this.setState({ loading: true })
            let headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `bearer ${token}`
            };
            let responseDivision = await axios({
                method: "get",
                url: `${baseurl}divisions`,
                headers: headers
            });
            let dataDivision = responseDivision.data;
            let allDivisions = dataDivision.map((division) => ({
                Value: division[`${lang == 'en' ? 'name' : 'name_bn'}`],
                id: division['_id'], label: division[`${lang == 'en' ? 'name' : 'name_bn'}`]
            }));

            let responseDistrict = await axios({
                method: "get",
                url: `${baseurl}districts`,
                headers: headers
            });
            let dataDistrict = responseDistrict.data;
            let allDistricts = dataDistrict.map((district) => ({
                Value: district[`${lang == 'en' ? 'name' : 'name_bn'}`],
                id: district['_id'], label: district[`${lang == 'en' ? 'name' : 'name_bn'}`], division: district['division']
            }));

            let responseUpazela = await axios({
                method: "get",
                url: `${baseurl}upazilas`,
                headers: headers
            });
            let dataUpazela = responseUpazela.data;
            let allUpazelas = dataUpazela.map((upazela) => ({
                Value: upazela[`${lang == 'en' ? 'name' : 'name_bn'}`],
                id: upazela['_id'],
                label: upazela[`${lang == 'en' ? 'name' : 'name_bn'}`],
                district: upazela['district'],
                division: upazela['division'],
                latitude: upazela['latitude'],
                longitude: upazela['longitude']
            }));

            console.log("asdasd", allDistricts)
            console.log("upazela", allUpazelas)

            if (responseDistrict && responseDivision && dataUpazela) {
                this.setState({ allDistricts, allDivisions, allUpazelas, loading: false })
            }

        } catch (error) {
            return error;
        }
    }

    handleChangeDivision = selectedDivision => {
        let { lang } = this.props.match.params
        this.setState({ selectedDivision });
        let allDistricts = []
        this.state.allDistricts.map(district => {
            if (district.division.name == selectedDivision.Value && lang == 'en') {
                allDistricts.push(district)
            }
                if (district.division.name_bn == selectedDivision.Value && lang == 'bn') {
                    allDistricts.push(district)
                }
            
        });
        // this.setState({allDistricts: updateDistricts})
        console.log(`Option selected:`, selectedDivision);
        console.log(`updateDistricts:`, allDistricts);
        this.setState({ allDistricts })

    };

    handleChangeDistrict = selectedDistrict => {
        let { lang } = this.props.match.params
        this.setState({ selectedDistrict });
        let allUpazelas = []
        this.state.allUpazelas.map(upazela => {
            if (upazela.district.name == selectedDistrict.Value && lang == 'en') {
                allUpazelas.push(upazela)
            }
            if (upazela.district.name_bn == selectedDistrict.Value && lang == 'bn') {
                allUpazelas.push(upazela)
            }
        });
        // this.setState({allUpazelas: updateDistricts})
        // console.log(`Option selected:`, selectedDistrict);
        // console.log(`updateUpazelas:`, allUpazelas);
        this.setState({ allUpazelas })
        // console.log(`All upaaazela :`, allUpazelas);

        // console.log(`Option selected:`, selectedDistrict);
    };

    handleChangeUpazela = selectedUpazela => {
        this.setState({ selectedUpazela });
        // console.log("option selected: ", selectedUpazela)
        let data = this.state.allUpazelas.find( ({ id }) => id === selectedUpazela.id );
        // console.log(`Option found:`, data);
    };

    submit = async () => {
        try {
            // console.log("selected upazela ", this.state.selectedUpazela)
            let { selectedUpazela } = this.state
            let params = this.props.match.params
            let url = `${chatlogyBaseUrl}a2ipush/${params.senderId}/${params.pageId}/${params.source}/${params.lang}`
            let headers = {
                "Content-Type": "application/x-www-form-urlencoded",
            }

            let data = {
                latitude: selectedUpazela.latitude,
                longitude: selectedUpazela.longitude,
                upazela_id: selectedUpazela.id,
                upazela_name: selectedUpazela.Value,
                district_id: selectedUpazela.district._id,
                district_name: selectedUpazela.district.name,
                division_id: selectedUpazela.division._id,
                division_name: selectedUpazela.division.name
            }
            // console.log("sent data", data)
            let response = await axios.post(url, data)
            // console.log("Ressssss", response)
            if(response){
                return window.close()
            }
        } catch (error) {
            // console.log(error)
        }
    }

    reset = () => {
        this.setState({
            selectedDivision: null,
            selectedDistrict: null,
            selectedUpazela: null
        })
        this.fetchData()
    }

    render() {
        const { selectedDivision, selectedDistrict, selectedUpazela, allDivisions, allDistricts, allUpazelas } = this.state;
        let { lang } = this.props.match.params

        return (
            <div className="container">
                {!this.state.loading && <div className="p-2">
                    <div className="form-group">
                        <p className="">{lang == 'en' ? "Select Division" : "বিভাগ নির্বাচন করুন"}</p>
                        <Select
                            className
                            isDisabled={selectedDivision ? true : false}
                            value={selectedDivision}
                            onChange={this.handleChangeDivision}
                            options={allDivisions}
                        />
                    </div>
                    <div className="form-group">
                        <p className="">{lang == 'en' ? "Select District" : "জেলা নির্বাচন করুন"}</p>
                        <Select
                            isDisabled={!selectedDivision || selectedDistrict || selectedUpazela ? true : false}
                            value={selectedDistrict}
                            onChange={this.handleChangeDistrict}
                            options={allDistricts}
                        />
                    </div>
                    <div className="form-group">
                        <p className="">{lang == 'en' ? "Select Upazela" : "উপজেলা নির্বাচন করুন"}</p>
                        <Select
                            isDisabled={!selectedDistrict ? true : false}
                            value={selectedUpazela}
                            onChange={this.handleChangeUpazela}
                            options={allUpazelas}
                        />
                    </div>

                    <button type="button" class="btn btn-primary mt-2 col-md-12" onClick={() => this.submit()}
                        disabled={this.state.selectedUpazela ? false : true}
                    >{lang == 'en' ? "Submit" : "সাবমিট"}</button>
                    <button type="button" class="btn btn-danger mt-2 col-md-12" onClick={() => this.reset()}>{lang == 'en' ? "Reset" : "পুনরায় নির্বাচন"}</button>
                </div>}
                {this.state.loading &&
                    <div className="d-flex justify-content-center">
                        <ReactLoading type={'bubbles'} color={'#0084ff'} height={367} width={75} />
                    </div>
                }

            </div>
        );
    }
}
