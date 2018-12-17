
const overlapingDays = (date1start, date1end, date2start, date2end) => {
  if (date1end < date2start) {
    return 0
  }
  if (date1end > date2end) {
    return (date1end - date2start)
  } else {
    return (date2end - date1start)
  }
}
const parseData = (data) => {
  let checkedEmp = []
  let timeArray = {}
  let orderderTimeArray = {}
  let returnTable = []
  data = data.split('\n')

  data.map(element => {
    element = element.split(',')

    if (!checkedEmp.includes(parseInt(element[0]))) {
      checkedEmp.push(parseInt(element[0]))

      let currentEmp = parseInt(element[0])
      let workedProject = []
      data.map(element => {
        element = element.split(',')
        if (parseInt(element[0]) === currentEmp) {
          workedProject.push({
            empId: parseInt(element[0]),
            projectId: parseInt(element[1]),
            startDate: new Date(element[2]),
            endDate: new Date(element[3])
          })
        }
      })

      workedProject.map((element) => {
        data.map((entry) => {
          entry = entry.split(',')

          if (entry[3] !== undefined) {
            if (entry[3].indexOf('NULL') > -1) {
              entry[3] = (new Date()).toLocaleDateString()
            }
          }
          if (entry[2] !== undefined) {
            if (entry[2].indexOf('NULL') > -1) {
              entry[2] = (new Date()).toLocaleDateString()
            }
          }
          let empId = parseInt(entry[0])
          let projectId = parseInt(entry[1])
          let days = 0
          if (empId === parseInt(0)) {
            return
          }

          if (projectId === parseInt(element.projectId)) {
            if (element.startDate > new Date(entry[2])) {
              days = overlapingDays(element.startDate, element.endDate, new Date(entry[2]), new Date(entry[3])) / (1000 * 3600 * 24)

              if (days > 0) {
                if (!(element.empId in timeArray)) {
                  timeArray[element.empId] = {}

                  if (!([parseInt(entry[0])] in timeArray[element.empId])) {
                    timeArray[element.empId][parseInt(entry[0])] = days
                  } else {
                    timeArray[element.empId][parseInt(entry[0])] += days
                  }
                } else {
                  if (!([parseInt(entry[0])] in timeArray[element.empId])) {
                    timeArray[element.empId][parseInt(entry[0])] = days
                  } else {
                    timeArray[element.empId][parseInt(entry[0])] += days
                  }
                }
              }
            } else {
              days = overlapingDays(new Date(entry[2]), new Date(entry[3]), element.startDate, element.endDate) / (1000 * 3600 * 24)

              if (days > 0) {
                if (!(element.empId in timeArray)) {
                  timeArray[element.empId] = {}

                  if (!([parseInt(entry[0])] in timeArray[element.empId])) {
                    timeArray[element.empId][parseInt(entry[0])] = days
                  } else {
                    timeArray[element.empId][parseInt(entry[0])] += days
                  }
                } else {
                  if (!([parseInt(entry[0])] in timeArray[element.empId])) {
                    timeArray[element.empId][parseInt(entry[0])] = days
                  } else {
                    timeArray[element.empId][parseInt(entry[0])] += days
                  }
                }
              }
            }
          }
        })
      })
    }
  })

  Object.keys(timeArray).map(function (key, index) {
    let maxVal = 0
    let indexKey = 0
    Object.keys(timeArray[key]).map(function (subKey, index) {
      if (timeArray[key][subKey] > maxVal && subKey !== key) {
        maxVal = timeArray[key][subKey]
        indexKey = subKey
      }
    })
    orderderTimeArray[key] = {
      maxVal: Math.floor(maxVal),
      index: indexKey
    }
  })
  let initLen = Object.keys(orderderTimeArray).length
  while (returnTable.length < initLen) {
    let maxVal = 0
    let indexKey = 0
    Object.keys(orderderTimeArray).map(function (key, index) {
      if (orderderTimeArray[key].maxVal > maxVal) {
        maxVal = orderderTimeArray[key].maxVal
        indexKey = key
      }
    })

    returnTable.push({ indexKey: indexKey, pair: orderderTimeArray[indexKey] })
    delete orderderTimeArray[indexKey]
    console.log(orderderTimeArray)
  }

  return JSON.stringify(returnTable)
}
let returnJson = ''
const sendFileModel = async (file, context) => {
  if (file !== undefined) {
    let data = ''

    var isProcced = false

    let timeout = setInterval((args) => {
      if (isProcced) {
        clearInterval(timeout)
      }
      isProcced = true
    }, 1000)
    const { stream, filename } = await file
    stream.on('data', (chunk) => {
      data += chunk
      isProcced = false
    })
    stream.on('end', (chunk) => {
      returnJson = parseData(data)
      global.result = new Promise(function (resolve, reject) {
        while (returnJson.length === 0) {

        }
        resolve(returnJson)
      })
    }
    )
  }
}
module.exports = { sendFileModel }
