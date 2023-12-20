import toast from "react-hot-toast";
import { sherr } from "./errors";
import { uniqueByKey } from "./unique";

export async function getNetwork(list, setList, setMore) {
    fetch("/api/network?take=50&skip=" + list.length, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      if (res.status === 200) {
        const result = await res.json()
        if (result.length < 1) {
          setMore(false)
          return
        } else {
          setMore(true)
        }
        setList(uniqueByKey([...list, ...result], 'email'))
        return result
      }
      sherr(res)
    });
  }