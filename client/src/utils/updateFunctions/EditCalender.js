import { QUERY_CURRENT_USER } from "../queries";

const EditCalender = (cache, { data: { editCalender } }) => {

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

    console.log("++++++==========++++++++++")
    console.log(cache.readQuery({ query: QUERY_CURRENT_USER }))

}

export default EditCalender