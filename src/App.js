import { BsFillCalendarEventFill } from "react-icons/bs";
import AddAppointment from "./components/AddAppointment";

function App() {
  

  return (
    <>
      <div className="App container mx-auto mt-3 font-thin">
        <h1 className="text-5xl mb-4">
          <BsFillCalendarEventFill /> Slot Booking
        </h1>
        <AddAppointment
        />
      </div>
    </>
  );
}

export default App;
