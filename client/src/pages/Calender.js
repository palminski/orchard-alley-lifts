import { useQuery, useMutation } from "@apollo/client";
import { QUERY_CURRENT_USER } from "../utils/queries";
import { EDIT_CALENDER } from "../utils/mutations";
import { useState } from "react";
import gainsIcon from "../images/icons/Will_Design.svg";

const Calender = () => {
  //===[States]=============================================
  const [calenderState, setCalenderState] = useState({});

  //===[Queries]=============================================
  const { loading, data } = useQuery(QUERY_CURRENT_USER, {
    onCompleted: (data) => setCalenderState(data.currentUser.calender),
  });
  const user = data?.currentUser;

  //===[Mutations]=============================================
  const [editCalender] = useMutation(EDIT_CALENDER, {
    update(cache, { data: { editCalender } }) {
      try {
        const { currentUser } = cache.readQuery({ query: QUERY_CURRENT_USER });

        let newCalender = {
          _id: currentUser.calender._id,
          monday: editCalender.calender.monday,
          tuesday: editCalender.calender.tuesday,
          wednesday: editCalender.calender.wednesday,
          thursday: editCalender.calender.thursday,
          friday: editCalender.calender.friday,
          saturday: editCalender.calender.saturday,
          sunday: editCalender.calender.sunday,
        };

        cache.writeQuery({
          query: QUERY_CURRENT_USER,
          data: { currentUser: { ...currentUser, calender: newCalender } },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

  //===[Functions]=============================================
  async function handleFormChange(event) {
    const { name, value } = event.target;

    try {
      const mutationResponse = await editCalender({
        variables: {
          ...calenderState,
          [name]: value,
        },
        optimisticResponse: {
          editCalender: {
            __typename: "User",
            calender: {
              ...calenderState,
              [name]: value,
              
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
      {loading ? (
        <>
          <h1>Loading...</h1>
        </>
      ) : (
        <>
          <h1 className="calendar-h1">Calender</h1>
          {calenderState && (
            <form className="calendar-cont">
              <div className="calendar-dates">
                <label htmlFor="monday">Monday: </label>
                <select
                  className="date-input"
                  name="monday"
                  value={calenderState.monday}
                  onChange={handleFormChange}
                >
                  <option value="none">none</option>
                  {user.workouts &&
                    user.workouts.map((workout) => (
                      <option key={workout._id} value={workout._id}>
                        {workout.name}
                      </option>
                    ))}
                </select>
              </div>
              <br></br>
              <div className="calendar-dates">
                <label htmlFor="tuesday">Tuesday: </label>
                <select
                  className="date-input"
                  name="tuesday"
                  value={calenderState.tuesday}
                  onChange={handleFormChange}
                >
                  <option value="none">none</option>
                  {user.workouts &&
                    user.workouts.map((workout) => (
                      <option key={workout._id} value={workout._id}>
                        {workout.name}
                      </option>
                    ))}
                </select>
              </div>
              <br></br>
              <div className="calendar-dates">
                <label htmlFor="wednesday">Wednesday: </label>
                <select
                  className="date-input"
                  name="wednesday"
                  value={calenderState.wednesday}
                  onChange={handleFormChange}
                >
                  <option value="none">none</option>
                  {user.workouts &&
                    user.workouts.map((workout) => (
                      <option key={workout._id} value={workout._id}>
                        {workout.name}
                      </option>
                    ))}
                </select>
              </div>
              <br></br>
              <div className="calendar-dates">
                <label htmlFor="thursday">Thursday: </label>
                <select
                  className="date-input"
                  name="thursday"
                  value={calenderState.thursday}
                  onChange={handleFormChange}
                >
                  <option value="none">none</option>
                  {user.workouts &&
                    user.workouts.map((workout) => (
                      <option key={workout._id} value={workout._id}>
                        {workout.name}
                      </option>
                    ))}
                </select>
              </div>
              <br></br>
              <div className="calendar-dates">
                <label htmlFor="friday">Friday: </label>
                <select
                  className="date-input"
                  name="friday"
                  value={calenderState.friday}
                  onChange={handleFormChange}
                >
                  <option value="none">none</option>
                  {user.workouts &&
                    user.workouts.map((workout) => (
                      <option key={workout._id} value={workout._id}>
                        {workout.name}
                      </option>
                    ))}
                </select>
              </div>
              <br></br>
              <div className="calendar-dates">
                <label htmlFor="saturday">Saturday: </label>
                <select
                  className="date-input"
                  name="saturday"
                  value={calenderState.saturday}
                  onChange={handleFormChange}
                >
                  <option value="none">none</option>
                  {user.workouts &&
                    user.workouts.map((workout) => (
                      <option key={workout._id} value={workout._id}>
                        {workout.name}
                      </option>
                    ))}
                </select>
              </div>
              <br></br>
              <div className="calendar-dates">
                <label htmlFor="sunday">Sunday: </label>
                <select
                  className="date-input"
                  name="sunday"
                  value={calenderState.sunday}
                  onChange={handleFormChange}
                >
                  <option value="none">none</option>
                  {user.workouts &&
                    user.workouts.map((workout) => (
                      <option key={workout._id} value={workout._id}>
                        {workout.name}
                      </option>
                    ))}
                </select>
              </div>
              <br></br>
            </form>
          )}
        </>
      )}
      <div className="icon-containter">
        <img src={gainsIcon} className="gains-icon" alt="Master Gains icon" />
      </div>
    </>
  );
};

export default Calender;
