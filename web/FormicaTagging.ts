import TagManager from "./TagManager";
import $ from "jquery";


class FormicaTagging implements TagManager {


  public constructor() {
  }

  public initialize() {
    const configurations = this.loadConfiguration()
    const test = this.prepareTriggers(configurations)
  }

  public loadConfiguration() {
    const configs = [
      {
        trigger: {
          type: "click"
        },
        filters: {
          condition: "class",
          operator: "equal",
          value: "PrintedWorksAd"
        }
      },
      {
        trigger: {
          type: "click"
        },
        filters: [{
          condition: "class",
          operator: "contains",
          value: "AddToCart"
        },
          {
            condition: "class",
            operator: "notEqual",
            value: "AddToC1212eart"
          },
          {
            condition: "currentPath",
            operator: "equal",
            value: "/"

          }

        ]
      },
      {
        trigger: {
          type: "historyChange"
        },
        filters: [{
          condition: "newPath",
          operator: "contains",
          value: "cart"
        }, {
          condition: "currentPath",
          operator: "equal",
          value: "/"
        }]
      }
    ]
    return configs
  }

  public jqueryOperatorParser(filter: any) {
    switch (filter.operator) {

      case "equal":
        return "="

      case "contains":
        return "*="

      case "startsWith":
        return "|="

      case "endsWith":
        return "$="

      case "notEqual":
        return "!="
    }
  }

  public operatorParser(arg1: any, arg2: any, operator: any) {
    switch (operator) {

      case "equal":
        return arg1 == arg2

      case "contains":
        if (arg2 != undefined) {
          return arg1.includes(arg2)
        } else {
          return false
        }
      case "startsWith":
        if (arg2 != undefined) {
          return arg1.startsWith(arg2)
        } else {
          return false
        }
      case "endsWith":
        if (arg2 != undefined) {
          return arg1.endsWith(arg2)
        } else {
          return false
        }
      case "notEqual":
        return arg1 != arg2
    }
  }

  public prepareFilter(filter: any, externalValue?: any) {
    switch (filter.condition) {

      case "class":
        return `[class${this.jqueryOperatorParser(filter) + filter.value}]`
      case "id":
        return `[id${this.jqueryOperatorParser(filter) + filter.value}]`
      case "currentPath":
        let pathName = window.location.pathname
        return this.operatorParser(pathName, filter.value, filter.operator)
      case "currentUrl":
        let uri = window.location.href
        return this.operatorParser(uri, filter.value, filter.operator)
      case "currentHostname":
        let hostName = window.location.hostname
        return this.operatorParser(hostName, filter.value, filter.operator)
      case "newPath":
        return this.operatorParser(externalValue, filter.value, filter.operator)
      case "newUrl":
        return this.operatorParser(externalValue, filter.value, filter.operator)
      case "newHostname":
        return this.operatorParser(externalValue, filter.value, filter.operator)

      case undefined:
        return true
    }
  }

  public clickTrigger(config: any) {
    let filters: any = []
    let secondTypeFilters: any = []
    if (Array.isArray(config.filters)) {
      config.filters.map((e: any) => {
        if (e.condition == "class" || e.condition == "id" || e.condition == undefined) {
          let filter = this.prepareFilter(e)
          filters.push(filter)
        } else {
          secondTypeFilters.push(e)
        }
      })

    } else {
      if (config.condition == "class" || config.condition == "id" || config.condition == undefined) {
        let filter = this.prepareFilter(config.filters)
        filters.push(filter)
      } else {
        secondTypeFilters.push(config.filters)
      }
    }
    const checkFilter = (e: any) => {
      return this.prepareFilter(e)
    }
    $(function () {
        // Use .join("") for AND
        // @ts-ignore
        $(`${filters.join("")}`).filter(function () {
          let results: any = []
          // I created results so we can use the other time to log why it's not working.
          secondTypeFilters.map((e: any) => {
            results.push(checkFilter(e))
          })
          return results.indexOf(false) == -1;
        }).on("click", function (e) {
          let hostName = window.location.hostname
          let pathName = window.location.pathname
          //TODO ISTEK BURADA ATILACAK CLICK
          console.log(hostName, pathName)
          console.log(e)
          // @ts-ignore
          console.log(this)
        })
      }
    )

  }

  public historyChangeTrigger(config: any) {
    const externalValueDecider = (e: any, path: any) => {
      //Buradan undefined dönüşü eğer ki externalValue kullanılıyorsa problem yaratıyor
      switch (e.condition) {
        case "newPath":
          return path
        case "newUrl":
          return ""
        case "newHostname":
          return ""
        default:
          return undefined
      }
    }

    const prepareFilter = (arg1: any, externalFilter: any) => {
      return this.prepareFilter(arg1, externalFilter)
    }

    let _pushState = History.prototype.pushState;
    History.prototype.pushState = function (state, title, url) {
      //new url istenilen ile eşit mi diye kontrol sağlıyor.
      let results: any = []
      // I created results so we can use the other time to log why it's not working.
      config.filters.map((e: any) => {
        // burada url dışında gerekli şeyler de gönderilecek birazdan gelince yapıcam :')
        const externalValue = externalValueDecider(e, url)
        results.push(prepareFilter(e, externalValue))
      })

      if (results.indexOf(false) == -1) {
        //TODO ISTEK BURADA ATILACAK historyChange
        console.log(this, state, title, url)
        console.log(config)
        console.log('URL changed', url)
      }
      _pushState.call(this, state, title, url);

    };
  }

  public prepareTriggers(configs: Array<any>) {
    /*    AND operation
        a=$('[myc="blue"][myid="1"][myid="3"]');
        OR operation, use commas
        a=$('[myc="blue"],[myid="1"],[myid="3"]');
        */
    configs.map((d: any) => {
      switch (d.trigger.type) {
        case "click":
          this.clickTrigger(d)
          return true
        case "historyChange":
          this.historyChangeTrigger(d)
          break
        case "domReady":
          break
      }
    })
    return true
  }


  public listen() {
  }
}

export default FormicaTagging;
