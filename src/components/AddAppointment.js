import { useEffect, useState } from "react";
import { BiCalendarPlus } from "react-icons/bi";
import { BsFillBookmarkFill, BsFillHandIndexThumbFill } from 'react-icons/bs';
import { Alert, Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';  // Importing of all the modules

const AddAppointment = () => {  // Initilization of all the states
  const [aptDate, setAptDate] = useState(new Date());   // Assigning apointment date to initial value
  const [arr, setArr] = useState([]);  //  Assigning array of the values to empty array 
  const [bookingId, setBookingId] = useState(""); // Initialised booking id to empty string
  const [showReqAlert, setShowReqAlert] = useState(false); // Setting the Alert to false
  const [bookingStart, setBookingStart] = useState(new Date());  // Setting the booking start time to initial value
  const [description, setDesc] = useState('');  // Initialising the description to empty string
  const [bookingEnd, setBookingEnd] = useState(new Date());  // Setting the booking end time to initial value
  const [loader, setLoader] = useState(false);  // Setting the loader initial value
  const [bookingInfo, setBookingInfo] = useState(false);  // Setting the booking info state to initial false
  const [editArr, setEditArr] = useState([]);  // Setting the edit individual array to edit individually
  const [startEdit, setStartEdit] = useState([]);  // Initializing the start time edit array to empty array
  const [endEdit, setEndEdit] = useState([]);  // Initializing the end time edit array to empty array
  const [showDuration, setShowDuration] = useState(false); // Initializing the duration of start and end time to false to show thw alert
  const [endTimeGreater, setEndTimeGreater] = useState(false); // Initializing the state to false to show the alert
  const [startDate, setStartDate] = useState([]);

  const candidateId = "VmFyc2hh"; // Initializing the candidate id

  //const [hours, setHours] = useState();
  //const [mins, setMinutes] = useState();


  // const picker = document.getElementById('aptDate');
  // picker.addEventListener('input', function(e){
  //   var day = new Date(this.value).getUTCDay();
  //   if([6,0].includes(day)){
  //   e.preventDefault();
  //   this.value = '';
  //   alert('You can not select Weekends!');
  //   }
  // });

  const submitData = () => {  // Calling of submit function on click of submit button

    var startDur = moment(bookingStart);
    var endDur = moment(bookingEnd);
    let duration = endDur.diff(startDur, 'minutes'); // Calculating the duration between start time and end time

    if (bookingId == '') {  // Checks for required field and time durations
      setShowReqAlert(true);
      setShowDuration(false);

    } else if (duration < 0) {  // End time should not be greater than start time calculation
      setEndTimeGreater(true);
      setShowDuration(true);
      setShowReqAlert(false);

    } else if (!(duration == 60 || duration == 30) || (duration > 60)) {  // Booking can only be done for 30 mins or 60 mins
      setShowDuration(true);  
      setShowReqAlert(false);
      setEndTimeGreater(false);


    } else {  // Sending the data to the server to get all the bookings and send the added ones
      setLoader(true);
      setBookingInfo(true);
      const jsonData = {
        "bookingId": bookingId,
        //   "bookingStart": "2018-12-12T10:00",
        //  "bookingEnd": "2018-12-12T10:30",

        "bookingStart": moment(bookingStart).format('YYYY-MM-DDTHH:mm'),
        "bookingEnd": moment(bookingEnd).format('YYYY-MM-DDTHH:mm'),
        "description": description
      }
      let arr = [];

      console.log('jsonData', jsonData);

      // Http call for the posting the data to the server

      axios.post("https://qotp4gi9x5.execute-api.eu-west-2.amazonaws.com/Test/" + candidateId, jsonData)
        .then((response) => {

          axios.get("https://qotp4gi9x5.execute-api.eu-west-2.amazonaws.com/Test/" + candidateId)  // Http call for getting all the bookins
            .then((resData) => {
              setLoader(false);
              resData.data.forEach(element => {
                element.bookingStart = moment(element.bookingStart).format('hh:mm A');
                element.bookingEnd = moment(element.bookingEnd).format('hh:mm A');
                arr.push(element);
              });

              setArr(arr);  // Setting the array with new updated data
            });
        });
    }

  };

  const handleClose = () => setShowReqAlert(false);  // making the state as false on closing up of alert
  const handleDurationClose = () => setShowDuration(false);  // making the state as false on closing up of alert

  const deleteBooking = (booking) => {  // function for deleting the booking

    let arr = [];
    setLoader(true);  

    // Http calls for deleting the appt and getting the updated data
    axios.delete("https://qotp4gi9x5.execute-api.eu-west-2.amazonaws.com/Test/" + candidateId + '/' + booking.bookingId)
      .then((response) => {
        axios.get("https://qotp4gi9x5.execute-api.eu-west-2.amazonaws.com/Test/" + candidateId)
          .then((resData) => {
            setLoader(false);
            console.log('get', resData.data);
            resData.data.forEach(element => {
              element.bookingStart = moment(element.bookingStart).format('hh:mm A');
              element.bookingEnd = moment(element.bookingEnd).format('hh:mm A');
              arr.push(element);
            });

            console.log('getarr', arr);
            setArr(arr);
          });
      });

  };

  useEffect(() => {  // on change of array updating the data
    setArr(arr);
    console.log('after edit');

    
  }, [editArr, startEdit, endEdit]);

 
 

  const editBooking = (item, index) => {

    let tempEdit = [];
    console.log('edit', item);
    tempEdit[index] = true;
    arr.forEach(element => {
      if (element.bookingId == item.bookingId) {
        element.edit = true;

      }
    });
    setArr(arr);
    setEditArr(tempEdit);
    console.log('edit arr', arr);
    let arrTemp = [];
    // Http calls for editing the data and getting the updated ones
    // axios.put("https://qotp4gi9x5.execute-api.eu-west-2.amazonaws.com/Test/" + candidateId + '/' + item.bookingId)
    //   .then((response) => {
    //     axios.get("https://qotp4gi9x5.execute-api.eu-west-2.amazonaws.com/Test/" + candidateId)
    //       .then((resData) => {
    //         setLoader(false);

    //         console.log('get', resData.data);
    //         resData.data.forEach(element => {
    //           arrTemp.push(element);
    //         });

    //         setArr(arrTemp);
    //       });
    //   });
  };
  let tempStartEdit = [];

  const startDateFunc = (e, index) => { // function call on change os start time

    tempStartEdit.forEach(function(element, itemNumber) {

      if(itemNumber == index){
        tempStartEdit[index] = true;

      }else{
        tempStartEdit[index] = false;
      }

    });
   
    arr[index].bookingStart = e;

    setArr(arr);
    setStartEdit(tempStartEdit);

     // let tempStart = [];
     //tempStart[index] = e;
    // setStartDate(tempStart)

     console.log('startEdit', startEdit, startDate);
  };
  const endDateFunc = (e,  index) => { // function call on change os end time

    let tempEndEdit = [];
    tempEndEdit[index] = true;
    arr[index].bookingEnd = e;
    setArr(arr);
    setEndEdit(tempEndEdit);
  };

  return (
    <div>

      <Container >

        {
          loader ? (<div id="loader"><Spinner className="spinnerClass" animation="border" role="status">

          </Spinner></div>) : (

            <>
              <Card>
                <Card.Header><BiCalendarPlus className="inline-block align-text-top" /> Add Appointment</Card.Header>
                <Card.Body>

                  <Row> </Row>
                  <Row>
                    <Col xs={2} className="apt-label">Booking Id</Col>
                    <Col><input
                      onChange={(event) => {
                        setBookingId(event.target.value);
                      }}
                      type="text"
                      name="bookingId"
                      id="bookingId"
                      value={bookingId}
                      required
                      className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    /></Col>
                  </Row>
                  <Row>
                    <Col xs={2} className="apt-label">Apointment Date</Col>
                    <Col><DatePicker
                      onChange={(date) => setAptDate(date)}
                      //  onChange={(date) => setFormData({ ...formData, aptDate: date})}
                      name="aptDate"
                      id="aptDate"
                      selected={aptDate}
                      filterDate={(date) => date.getDay() !== 0 && date.getDay() !== 6}
                      placeholderText="Select a weekday"
                    /></Col>
                  </Row>

                  <Row>
                    <Col xs={2} className="apt-label">Start Time</Col>
                    <Col> <DatePicker
                      onChange={(date) => setBookingStart(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Time"
                      selected={bookingStart}
                      dateFormat="h:mm aa"
                      minTime={setHours(setMinutes(new Date(), 0), 9)}
                      maxTime={setHours(setMinutes(new Date(), 30), 17)}
                    /></Col>
                  </Row>

                  <Row>
                    <Col xs={2} className="apt-label">End Time</Col>
                    <Col><DatePicker
                      onChange={(date) => setBookingEnd(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Time"
                      selected={bookingEnd}
                      dateFormat="h:mm aa"
                      minTime={setHours(setMinutes(new Date(), 0), 9)}
                      maxTime={setHours(setMinutes(new Date(), 30), 17)}
                    /></Col>
                  </Row>
                  <Row>
                    <Col xs={2}>Description</Col>
                    <Col><input
                      onChange={(event) => {
                        setDesc(event.target.value);
                      }}
                      type="text"
                      name="description"
                      id="description"
                      value={description}
                      required
                      className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    /></Col>

                  </Row>
                  <Row>
                    <Col xs={2}></Col>
                    <Col><Button variant="primary" onClick={submitData}>Submit</Button>
                    </Col>
                    <Col></Col>
                  </Row>
                </Card.Body>
              </Card>

              {bookingInfo ? (<>

                <Card className="bookingsInfo">
                  <Card.Header> <BsFillBookmarkFill />   Bookings: </Card.Header>
                  <Card.Body>
                    <Card.Text >


                      {arr.map((item, index) => (
                        <Card id={item.bookingId} className="singleBookingsInfo">
                          <Card.Body>
                            <Card.Title >Booking Id:  {item.bookingId}</Card.Title>
                            <Card.Text >


                              <Row>
                                <Col xs={2}>Start Date:</Col>
                                <Col>
                                  {item.edit ? (<>
                                    <DatePicker
                                      onChange={(date) => startDateFunc(date, index)}
                                      showTimeSelect
                                      showTimeSelectOnly
                                      timeIntervals={30}
                                      timeCaption="Time"
                                      id={index}
                                      multiple={true}
                                      name={index + '-start'}
                                      // value={item.bookingStart}
                                         selected={startDate[index]}
                                      dateFormat="h:mm aa"
                                      minTime={setHours(setMinutes(new Date(), 0), 9)}
                                      maxTime={setHours(setMinutes(new Date(), 30), 17)}
                                    /></>) : (<>{item.bookingStart}</>)}
                                </Col>
                              </Row>

                              <Row>
                                <Col xs={2}>End Date:</Col>
                                <Col>{item.edit ? (<>
                                  <DatePicker
                                    onChange={(date) => endDateFunc(date, index)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={30}
                                    timeCaption="Time"
                                    id={index}
                                    name={index + '-end'}
                                    //selected={item.bookingEnd}
                                    dateFormat="h:mm aa"
                                    minTime={setHours(setMinutes(new Date(), 0), 9)}
                                    maxTime={setHours(setMinutes(new Date(), 30), 17)}
                                  />
                                </>) : (<>{item.bookingEnd}</>)}</Col>
                              </Row>

                              <Row>
                                <Col xs={2}>Description:</Col>
                                <Col>{item.Description}</Col>
                              </Row>
                              <Row >
                                <Col xs={2}>
                                  <Button id={index} key={index} className="editButton" variant="secondary" onClick={() => editBooking(item)}>Edit</Button>

                                </Col>
                                <Col xs={2}>
                                  <Button id={index} key={index} className="deleteButton" variant="danger" onClick={() => deleteBooking(item)}>Delete</Button>

                                </Col>

                              </Row>
                            </Card.Text>
                          </Card.Body>
                        </Card>

                      ))}
                    </Card.Text>
                  </Card.Body>
                </Card></>) : (<></>)}
              {showReqAlert && !showDuration && <Modal show={showReqAlert} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title className="modalHeader">Alert</Modal.Title>
                </Modal.Header>
                <Modal.Body>Please fill in the required Info!</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>}
            </>)}

        {
          showDuration && !showReqAlert && <Modal show={showDuration} onHide={handleDurationClose}>
            <Modal.Header closeButton>
              <Modal.Title className="modalHeader">Alert</Modal.Title>
            </Modal.Header>
            {endTimeGreater ? (<>
              <Modal.Body>End Time cannot be less than Start time !!</Modal.Body>
            </>) : (<>
              <Modal.Body>You can only book the slot for 30 or 60 minutes !!</Modal.Body>
            </>)}
            <Modal.Footer>
              <Button variant="secondary" onClick={handleDurationClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        }

      </Container>
    </div>

  );
};

export default AddAppointment;
