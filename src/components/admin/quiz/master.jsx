import React, {Component} from 'react';
import Navbar from '../main/navbar';
import { BrowserRouter as Router, Route, Link, Redirect, NavLink } from 'react-router-dom';
import firebase from 'firebase';
import { Tab, Table, Label, Icon, Menu, Modal, Dimmer, Loader, Input, Button, Dropdown, Confirm } from 'semantic-ui-react';
import Error from '../error';
import Succes from '../succes';

class Quiz extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      id: '',
      quiz: [],
      titel: '',
      beschrijving: '',
      vragen: [],

      errorStatusInformatie: false,
      errorTitleInformatie: '',
      errorSubTitleInformatie: '',

      succesStatus: true,
      succesTitle: '',
      succesSubTitle: '',

      vragenModalOpen: false,
      valType: '',
      valVraag: '',
      vraagAntwoorden: [{text: '', goed: true}, {text: '', goed: false}, {text: '', goed: false}, {text: '', goed: false}],
      valValue: ['', '', '', ''],
      valGoedFout: [true, false, false, false],
      valTijd: 30,
      valScore: 100,
      valLink: '',

      confirmDeleteVraag: false,
      delVraagRef: '',

      confirmDeleteQuiz: false,
      redirectToQuizzen: false,

      newQuestion: false
    }

    this.handleTitelChange = this.handleTitelChange.bind(this);
    this.handleBeschrijvingChange = this.handleBeschrijvingChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleTitelChange(e){
    this.setState({titel: e.target.value});
  }

  handleBeschrijvingChange(e){
    this.setState({beschrijving: e.target.value});
  }

  handleSubmit(e){
    if(this.state.titel == ''){
      this.setState({
        errorStatusInformatie: true,
        errorTitleInformatie: 'Titel mag niet leeg zijn.',
        errorSubTitleInformatie: 'Controleer en probeer het opnieuw.'
      });
    } else {
      const Data = {
        titel: this.state.titel,
        beschrijving: this.state.beschrijving
      }
      firebase.database().ref().child('quizzen').child(this.state.id).update(Data);
    }
    e.preventDefault();
  }

  componentDidMount(){
    this.setState({
      id: this.props.match.params.id
    });
    var self = this;
    const rootRef = firebase.database().ref().child('quizzen');
    const ref = rootRef.child(this.props.match.params.id);

    ref.on('value', snap => {
        var snapshotVal = snap.val();

        if (snapshotVal == undefined) {
            snapshotVal = {};
        }
        if (snapshotVal.titel == undefined) {
            snapshotVal.titel = '';
        }
        if (snapshotVal.beschrijving == undefined) {
            snapshotVal.beschrijving = '';
        }
        if (snapshotVal.vragen == undefined) {
            snapshotVal.vragen = [];
        }

      self.setState({
        quiz: snapshotVal,
        titel: snapshotVal.titel,
        beschrijving: snapshotVal.beschrijving,
        vragen: snapshotVal.vragen,
      });
    });

    this.vragenModalClose();
  }

  vragenModalClose = () => {
      console.log("CLOSING VRAGENMODAL");
      this.setState({valType: 'meerkeuze', valTijd: 30, valValue: ['', '', '', ''], valScore: 10, valGoedFout: [true, false, false, false], vraagAntwoorden: [{text: ''}, {text: ''}, {text: ''}, {text: ''}], valVraag: '', valLink: ''});
      this.setState({vragenModalOpen: false});
  }

  handleTableClick = (item, i) => {
      this.setState({currentSelectedItem: i, valType: item.type, valVraag: item.vraag, valTijd: item.time, valScore: item.score, vraagAntwoorden: item.keuzes, valLink: item.link});
      this.setState({vragenModalOpen: true});
  }

  handleDeleteButtonClick = (item, i) => {
      var ref = firebase.database().ref('/quizzen/'+this.state.id+'/vragen/'+i+'/');
      this.setState({confirmDeleteVraag: true, delVraagRef: ref});
  }

  delRecord = (ref) => {
      ref.remove();
  }

  renderVragen = (item, i) => {
      return(
        <Table.Row key={i}>
            <Table.Cell><Button icon negative onClick={() => {this.handleDeleteButtonClick(item, i)}}><Icon name='trash' /></Button></Table.Cell>
            <Table.Cell onClick={() => {this.handleTableClick(item, i)}}>{item.vraag}</Table.Cell>
            <Table.Cell onClick={() => {this.handleTableClick(item, i)}}>{item.type}</Table.Cell>
            <Table.Cell onClick={() => {this.handleTableClick(item, i)}}>{item.score}</Table.Cell>
            <Table.Cell onClick={() => {this.handleTableClick(item, i)}}>{item.time}</Table.Cell>
            <Table.Cell onClick={() => {this.handleTableClick(item, i)}}>{item.link}</Table.Cell>
        </Table.Row>
      );
  }

  handleDeleteQuiz = () => {
      this.setState({confirmDeleteQuiz: true});
  }

  render() {
      if(this.state.vragen == undefined) {
          this.state.vragen = [];
      }
      if(this.state.redirectToQuizzen == true) {
          return(<Redirect to="/admin/quizzen" />);
      }
    const panes = [
      { menuItem: 'Vragen', render: () => <Tab.Pane attached={false}>
          <Table celled>
              <Table.Header>
                <Table.Row>
                    <Table.HeaderCell><Button positive onClick={() => {this.setState({vragenModalOpen: true, newQuestion: true})}}>Nieuwe vraag</Button></Table.HeaderCell>
                    <Table.HeaderCell>Vraag</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Score (Pt.)</Table.HeaderCell>
                    <Table.HeaderCell>Tijd (Sec.)</Table.HeaderCell>
                    <Table.HeaderCell>Youtube Link</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {this.state.vragen.map(this.renderVragen)}
              </Table.Body>
          </Table>
      </Tab.Pane> },
      { menuItem: 'Algemeen', render: () => <Tab.Pane attached={false}>
        <form onSubmit={this.handleSubmit} className="ui form">
          <Error key='mainError' status={this.state.errorStatusInformatie} title={this.state.errorTitleInformatie} subtitle={this.state.errorSubTitleInformatie}/>
          <Succes key='mainSucces' status={this.state.succesStatus} title={this.state.succesTitle} subtitle={this.state.succesSubTitle}/>
          <h4 className="ui dividing header">Algemene informatie</h4>
          <div className="field">
            <label>Titel: </label>
            <input type="text" value={this.state.titel} onChange={this.handleTitelChange}/>
          </div>
          <div className="field">
            <label>Beschrijving: </label>
            <input type="text" value={this.state.beschrijving} onChange={this.handleBeschrijvingChange}/>
          </div>
          <button className="ui submit positive button" type="submit">Opslaan</button>
        </form>
        <br/>
        <Button inverted color='red' onClick={this.handleDeleteQuiz}>Delete Quiz</Button>
      </Tab.Pane> },
    ]

    return (
      <div>
        <Navbar />
        <div className="ui container">
          <h2 className="ui header">
            {this.state.quiz.titel}
            <div className="sub header">{this.state.quiz.beschrijving}</div>
          </h2>
          {/* <div className="ui segment">
            <div class="ui form">
              <h4 class="ui dividing header">Quiz informatie</h4>
              <div class="field">
                <label>Titel: </label>
                <input type="text" />
              </div>
              <div class="field">
                <label>Beschrijving: </label>
                <textarea rows="1"></textarea>
              </div>
            </div>
          </div> */}

          <Tab menu={{ pointing: true }} panes={panes} />
          <Confirm
            content='Weet je zeker dat je deze quiz wilt verwijderen?'
              open={this.state.confirmDeleteQuiz}
              size='small'
              cancelButton='Annuleren'
              confirmButton='DELETE'
              onCancel={() => {this.setState({confirmDeleteQuiz: false})}}
              onConfirm={() => {this.setState({confirmDeleteQuiz: false});var r = firebase.database().ref('/quizzen/'+this.state.id);this.delRecord(r);this.setState({redirectToQuizzen: true});}}
            />
          <Confirm
            content='Weet je zeker dat je deze vraag wilt verwijderen?'
              open={this.state.confirmDeleteVraag}
              size='small'
              cancelButton='Nee'
              confirmButton='Ja'
              onCancel={() => {this.setState({confirmDeleteVraag: false})}}
              onConfirm={() => {this.setState({confirmDeleteVraag: false});this.delRecord(this.state.delVraagRef)}}
            />
        </div>
        <Modal
          size='large'
          closeIcon
          open={this.state.vragenModalOpen}
          onClose={this.vragenModalClose}
        >
            <Dimmer active={false} inverted>
                <Loader inverted>Loading</Loader>
            </Dimmer>
          <Modal.Header>Vraag aanpassen</Modal.Header>
          <Modal.Content scrolling>
                <span>Vraag: <br />
                <Input
                    defaultValue={this.state.valVraag}
                    placeholder='Vraag'
                    onChange={(e, { value }) => {
                        this.setState({valVraag: value});
                    }}
                />
                </span><br />
                <span>Type: <br />
                    <Dropdown
                        placeholder='Type vraag'
                        compact
                        selection
                        defaultValue={(this.state.valType == '') ? 'meerkeuze' : this.state.valType}
                        options={[
                                    {key: 'meerkeuze', text: 'Meerkeuze', value: 'meerkeuze'},
                                    {key: 'janee', text: 'Ja/Nee', value: 'janee'},
                                    {key: 'open', text: 'Open', value: 'open'}
                                ]}
                                onChange={(e, { value }) => {
                                    this.setState({valType: value});
                                }}
                    /><br />
                </span>
                <span>Tijd: <br /><Input
                    size='tiny'
                    labelPosition='right'
                    type='number'
                    label={{ basic: true, content: 'Sec.' }}
                    defaultValue={this.state.valTijd}
                    placeholder='Tijd'
                    onChange={(e, { value }) => {
                        this.setState({valTijd: value});
                    }}
                /></span><br />
                <span>Score: <br />
                <Input
                    labelPosition='right'
                    type='number'
                    label={{ basic: true, content: 'Pt.' }}
                    defaultValue={this.state.valScore}
                    placeholder='Score'
                    onChange={(e, { value }) => {
                        this.setState({valScore: value});
                    }}
                />              
                </span><br />
                <span>Youtube link: <br />
                <Input
                    defaultValue={this.state.valLink}
                    placeholder='Youtube link'
                    onChange={(e, { value }) => {
                        this.setState({valLink: value});
                    }}
                />
                </span><br />
                <Modal.Description>
                    {this.state.vraagAntwoorden.map((item, i) => {
                        var rendr = false;
                        var janee = false;
                        console.log(item);
                        // console.log(this.state.valValue);
                        this.state.valValue[i] = item.text;
                        this.state.valGoedFout[i] = item.goed;

                        if (this.state.valType == 'meerkeuze' && i < 4) {
                            rendr = true;
                        } else if (this.state.valType == 'open' && i < 1) {
                            return(
                                <div key={i}>
                                    <span><br />Hier kan geen antwoord aan worden gekoppeld.</span>
                                </div>
                            );
                        } else if (this.state.valType == 'janee' && i < 2) {
                            rendr = false;

                            var dV = true;

                            if (item.text == 'Ja') {
                                dV = 'Ja';
                            } else if (item.text == 'Nee') {
                                dV = 'Nee';
                            } else {
                                dV = 'Nee';
                            }


                            this.state.valValue[i] = dV;
                            this.state.valGoedFout[i] = item.goed;

                            return(
                                <div key={i}>
                                    <Dropdown
                                        placeholder='Ja/Nee'
                                        compact
                                        selection
                                        defaultValue={dV}
                                        options={[
                                                    {key: 'Ja', text: 'Ja', value: 'Ja'},
                                                    {key: 'Nee', text: 'Nee', value: 'Nee'}
                                                ]}
                                        onChange={(e, { value }) => {
                                            this.state.valValue[i] = value;
                                            this.state.vraagAntwoorden[i].text = value;
                                            this.setState({valValue: this.state.valValue});
                                            // console.log('VALUE CHANGE', this.state.valValue, value);
                                        }}
                                    />
                                    <span> </span>
                                    {console.log(this.state.valGoedFout)}
                                    <Dropdown
                                        placeholder='Goed'
                                        compact
                                        selection
                                        defaultValue={this.state.valGoedFout[i]}
                                        options={[
                                                    {key: true, text: 'Goed', value: true},
                                                    {key: false, text: 'Fout', value: false}
                                                ]}
                                        onChange={(e, { value }) => {
                                            this.state.valGoedFout[i] = value;
                                            this.setState({valGoedFout: this.state.valGoedFout});
                                        }}
                                    /><br /><br />
                                </div>
                            );
                        }

                        if (rendr) {
                            return(
                                <div key={i}>
                                <span><br />
                                    <Input
                                        defaultValue={this.state.valValue[i]}
                                        placeholder='Antwoord'
                                        onChange={(e, { value }) => {
                                            console.log(this.state);
                                            this.state.valValue[i] = value;
                                            this.state.vraagAntwoorden[i].text = value;
                                            this.setState({valValue: this.state.valValue});
                                        }}
                                    />
                                    <span> </span><Dropdown
                                        placeholder='Goed'
                                        compact
                                        selection
                                        defaultValue={(item.goed !== true && item.goed !== false) ? false : item.goed}
                                        options={[
                                                    {key: true, text: 'Goed', value: true},
                                                    {key: false, text: 'Fout', value: false}
                                                ]}
                                        // onChange={(e, { value }) => {this.setState({valGoedFout: value})}}
                                        onChange={(e, { value }) => {
                                            this.state.valGoedFout[i] = value;
                                            // this.setState({valGoedFout: this.state.valGoedFout});
                                            console.log(this.state.valGoedFout);
                                        }}
                                    />
                                </span><br />
                                </div>
                            );
                        }
                    })}
                </Modal.Description>
          </Modal.Content>

          <Modal.Actions>
          {/* DELETE BUTTON */}
            <Button animated='fade' negative floated='left' onClick={() => {this.state.newQuestion = false}}>
              <Button.Content hidden><Icon name='remove' /></Button.Content>
              <Button.Content visible>
                <Icon name='trash' />
              </Button.Content>
            </Button>

            {/* ANNULEREN BUTTON */}
            <Button negative icon='remove' labelPosition='right' content='Annuleren' onClick={() => {this.vragenModalClose(); this.state.newQuestion = false}}/>
            {/* UPDATE BUTTON */}
            <Button positive icon='checkmark' labelPosition='right' content='Update' onClick={() => {
                this.setState({vragenModalOpen: false});
                var r = firebase.database().ref('/quizzen/'+this.state.id+'/vragen/');
                r.on('value', (snapshot) => {
                    r.off('value');
                    if (this.state.currentSelectedItem == undefined || this.state.newQuestion == true) {
                      this.state.newQuestion = false;
                        var length = 0;

                        if (snapshot.val() == null || snapshot.val() == undefined) {
                            length = 0;
                        } else {
                            length = snapshot.val().length;
                        }

                        console.log('CURRENTSELECTEDITEM IS UNDEFINED.');
                        this.state.currentSelectedItem = length;
                        // this.setState({currentSelectedItem: length});
                    }
                    console.log(this.state.currentSelectedItem);
                    var ref = firebase.database().ref('/quizzen/'+this.state.id+'/vragen/'+this.state.currentSelectedItem+'/');

                    console.log(ref);

                    for (var i = 0; i < 4; i++) {
                      if (this.state.valGoedFout[i] == undefined) {
                        if (this.state.valGoedFout.indexOf(true) >= 0) {
                          this.state.valGoedFout[i] = false;
                        } else {
                          this.state.valGoedFout[i] = true;
                        }
                      }

                      if (this.state.valValue[i] == undefined) {
                        this.state.valValue[i] = '';
                      }
                    }

                    var dataPack = {
                        // ((this.state.valGoedFout[0] == undefined) ? true : this.state.valGoedFout[0])
                        "keuzes" : [ {
                            "goed" : this.state.valGoedFout[0],
                            "text" : this.state.valValue[0]
                          }, {
                              "goed" : this.state.valGoedFout[1],
                              "text" : this.state.valValue[1]
                          }, {
                              "goed" : this.state.valGoedFout[2],
                              "text" : this.state.valValue[2]
                          }, {
                              "goed" : this.state.valGoedFout[3],
                              "text" : this.state.valValue[3]
                          } ],
                          "score" : this.state.valScore,
                          "time" : this.state.valTijd,
                          "type" : this.state.valType,
                          "vraag" : this.state.valVraag,
                          "link" : this.state.valLink
                    }
                    // console.log(dataPack);
                    ref.update(dataPack);
                });

            }} />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }

}
export default Quiz;
