/**
 * This hook sets up a listener that listens for changes in the quizResults collection in the database. The results are then stored in a local state variable and returned by calls to this function.
 *
 * @returns array of topics
 */

import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function useAllresults(course) {
  const [results, setResults] = useState([]);
  const db = getFirestore();

  const students = [];
  const resultsFetched = [];
  useEffect(() => {
    onSnapshot(collection(db, "courses", course, "results"), (studentsList) => {
      studentsList.docs.forEach((doc) => {
        students.push(doc.data().email);
      });
      students.forEach((t) => {
        onSnapshot(
          collection(db, "courses", course, "results", t, "quizResults"),
          (resultsList) => {
            resultsList.docs.forEach((res) => {
              resultsFetched.push({ ...res.data(), id: res.id });
            });
          }
        );
      });
    });
    setResults(resultsFetched);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return results;
}

useAllresults.propTypes = {
  course: PropTypes.string,
};

export default useAllresults;
