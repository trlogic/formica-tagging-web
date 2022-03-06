import TagManager from "./TagManager";
import $ from "jquery";
import FTMConfiguration from "./FTMConfiguration";
import TriggerType from "./TriggerType";
import FTMFilter from "./FTMFilter";
import FTMFilterOperator from "./FTMFilterOperator";
import FTMFilterCondition from "./FTMFilterCondition";
import FTMFormType from "./FTMFormType";
import FTMOutputData from "./FTMOutputData";
import FTMOutput from "./FTMOutput";

class FormicaTagging implements TagManager {

  public constructor() {
  }

  public async initialize() {
    const configurations: Array<FTMConfiguration> = this.loadConfiguration()
    const startNow =  this.prepareTriggers(configurations)
  }

  public loadConfiguration() {
    const configs: Array<FTMConfiguration> = [
      {
        trigger: {
          type: TriggerType.DOM_LOAD
        },
        filters: [{
          condition: FTMFilterCondition.ASTERISK,
          operator: FTMFilterOperator.EQUAL,
          value: "PrintedWorksAd"
        }]
      },
      {
        trigger: {
          type: TriggerType.CLICK
        },
        filters: [{
          condition: FTMFilterCondition.CLASS,
          operator: FTMFilterOperator.CONTAINS,
          value: "AddToCart"
        },
          {
            condition: FTMFilterCondition.CLASS,
            operator: FTMFilterOperator.NOT_EQUAL,
            value: "AddToC1212eart"
          },
          {
            condition: FTMFilterCondition.CURRENT_PATH,
            operator: FTMFilterOperator.EQUAL,
            value: "/"

          }

        ]
      },
      {
        trigger: {
          type: TriggerType.HISTORY_CHANGE
        },
        filters: [{
          condition: FTMFilterCondition.NEW_PATH,
          operator: FTMFilterOperator.CONTAINS,
          value: "cart"
        }, {
          condition: FTMFilterCondition.CURRENT_PATH,
          operator: FTMFilterOperator.EQUAL,
          value: "/"
        }]
      },

      {
        trigger: {
          type: TriggerType.HISTORY_CHANGE
        },
        filters: [{
          condition: FTMFilterCondition.NEW_PATH,
          operator: FTMFilterOperator.NOT_EQUAL,
          value: "cart"
        }, {
          condition: FTMFilterCondition.CURRENT_PATH,
          operator: FTMFilterOperator.EQUAL,
          value: "/aswsws"
        }]
      },
      {
        trigger: {
          type: TriggerType.FORM_SUBMIT
        },
        filters: [{
          condition: FTMFilterCondition.ID,
          operator: FTMFilterOperator.CONTAINS,
          value: "form"
        }]
      },
      {
        trigger: {
          type: TriggerType.CLICK
        },
        filters: [{
          condition: FTMFilterCondition.CLASS,
          operator: FTMFilterOperator.CONTAINS,
          value: "ant-btn"
        }]
      }
    ]
    return configs
  }

  public jqueryOperatorParser(filter: FTMFilter) {
    switch (filter.operator) {

      case FTMFilterOperator.EQUAL:
        return "="

      case FTMFilterOperator.CONTAINS:
        return "*="

      case FTMFilterOperator.STARTS_WITH:
        return "|="

      case FTMFilterOperator.ENDS_WITH:
        return "$="

      case FTMFilterOperator.NOT_EQUAL:
        return "!="
    }
  }

  public applyOperator(arg1: any, arg2: any, operator: FTMFilterOperator) {
    switch (operator) {

      case FTMFilterOperator.EQUAL:
        return arg1 == arg2

      case FTMFilterOperator.CONTAINS:
        if (arg2 != undefined) {
          return arg1.includes(arg2)
        } else {
          return false
        }
      case FTMFilterOperator.STARTS_WITH:
        if (arg2 != undefined) {
          return arg1.startsWith(arg2)
        } else {
          return false
        }
      case FTMFilterOperator.ENDS_WITH:
        if (arg2 != undefined) {
          return arg1.endsWith(arg2)
        } else {
          return false
        }
      case FTMFilterOperator.NOT_EQUAL:
        return arg1 != arg2
    }
  }

  public prepareJqueryFilter(filter: FTMFilter) {
    switch (filter.condition) {

      case FTMFilterCondition.CLASS:
        return `[class${this.jqueryOperatorParser(filter) + filter.value}]`
      case FTMFilterCondition.ID:
        return `[id${this.jqueryOperatorParser(filter) + filter.value}]`
      default:
        return `*`
    }
  }

  public solveFilter(filter: FTMFilter, externalValue?: any) {
    switch (filter.condition) {

      case "class":
      case "id":
      case "*":
        return this.prepareJqueryFilter(filter)
      case "currentPath":
        let pathName = window.location.pathname
        return this.applyOperator(pathName, filter.value, filter.operator)
      case "currentUrl":
        let uri = window.location.href
        return this.applyOperator(uri, filter.value, filter.operator)
      case "currentHostname":
        let hostName = window.location.hostname
        return this.applyOperator(hostName, filter.value, filter.operator)
      case "newPath":
        return this.applyOperator(externalValue, filter.value, filter.operator)
      case "newUrl":
        return this.applyOperator(externalValue, filter.value, filter.operator)
      case "newHostname":
        return this.applyOperator(externalValue, filter.value, filter.operator)

      default:
        return false
    }
  }

  public prepareOutput(event: TriggerType, jqueryEvent?: any, jquerySelector?: any, externalValues?: any) {
    let output: FTMOutput = {
      event: event,
      data: {
        start: new Date().getTime(),
        currentPath: window.location.pathname,
        currentHostname: window.location.hostname,
        currentUrl: window.location.href,
        fullElementPath: [""],
        elementClasses: "",
        elementId: "",
        elementTarget: "",
        newUrl: "",
        newPath: "",
        newHostname: "",
        oldUrl: window.location.href,
        FormData: []
      }
    }


    switch (event) {
      case TriggerType.CLICK:
        output.data.fullElementPath = this.fullElementPathFinder(jquerySelector)
        break
      case TriggerType.DOM_LOAD:
      case TriggerType.DOM_READY:
        break
      case TriggerType.HISTORY_CHANGE:
        //externalValues.state
        output.data.newPath = externalValues.url
        output.data.newUrl = output.data.currentHostname + externalValues.url
        output.data.newHostname = output.data.currentHostname
        break
      case TriggerType.FORM_SUBMIT:
        output.data.fullElementPath = this.fullElementPathFinder(jquerySelector)
        let values = $(jquerySelector)
        let inputs: Array<FTMFormType> = new Array<FTMFormType>();
        values.find('input, textarea, select').each(function (this: any, k: number, v: any) {
          const info: FTMFormType = {
            "name": v.name,
            "class": v.classList.value,
            "id": v.id,
            "type": v.type,
            "value": ""
          }
          if (v.type == "checkbox") {
            info.value = v.checked;
          } else {
            info.value = v.value;
          }
          inputs.push(info)
        });
        output.data.FormData = inputs
        break
    }

    //LAST
    this.sendOutput(output)

  }

  public sendOutput(output: FTMOutput) {
    console.log(output)
    //TODO SEND OUTPUT IN HERE
  }

  public fullElementPathFinder(jquerySelector: any) {
    let pathArray: Array<string> = new Array<string>()
    $(jquerySelector).parents().map(function () {
      let element = this.localName
      if (this.className != "") {
        let className = "." + this.className.replace(" ", ".")
        element += className
      }
      if (this.id != "") {
        let id = "#" + this.id.replace(" ", "#")
        element += id
      }
      pathArray.push(element)
    })
    return pathArray

  }

  public runTriggerInEverywhere(functionName: any) {
    let _pushState = History.prototype.pushState;
    History.prototype.pushState = function (state, title, url) {
      functionName()
      _pushState.call(this, state, title, url);

    };
}

  public clickTrigger(config: FTMConfiguration) {
    let filters: Array<any> = []
    let secondTypeFilters: Array<any> = []
    const jqueryPreFilter = config.filters.filter((f) => f.condition == "class" || f.condition == "id")
    const otherPreFilter = config.filters.filter((f) => !(f.condition == "class" || f.condition == "id"))
    jqueryPreFilter.forEach(e => filters.push(this.solveFilter(e)))
    otherPreFilter.forEach(e => secondTypeFilters.push(e))

    const _this = this;
    let trigger = () => {
      $(function () {
        // Use .join("") for AND
        // @ts-ignore
        $(`${filters.join("")}`).filter(function () {
          let results: Array<boolean> = []
          // I created results so we can use the other time to log why it's not working.
          secondTypeFilters.map((e: FTMFilter) => {
            results.push(_this.solveFilter(e))
          })
          return results.indexOf(false) == -1;
        }).on("click", function (e: any) {
          _this.prepareOutput(TriggerType.CLICK, e, this)
        })
      })
    }
      this.runTriggerInEverywhere(trigger())
    }

  public formSubmitTrigger(config: FTMConfiguration) {
    let filters: Array<any> = []
    let secondTypeFilters: Array<any> = []
    const jqueryPreFilter = config.filters.filter((f) => f.condition == "class" || f.condition == "id")
    const otherPreFilter = config.filters.filter((f) => !(f.condition == "class" || f.condition == "id"))
    jqueryPreFilter.forEach(e => filters.push(this.solveFilter(e)))
    otherPreFilter.forEach(e => secondTypeFilters.push(e))

    const _this = this;
    let trigger = () => $(function () {
        // Use .join("") for AND
        // @ts-ignore
        $(`${filters.join("")}`).filter(function () {
          let results: Array<boolean> = []
          // I created results so we can use the other time to log why it's not working.
          secondTypeFilters.map((e: FTMFilter) => {
            results.push(_this.solveFilter(e))
          })
          return results.indexOf(false) == -1;
        }).on("submit", function (e) {
          _this.prepareOutput(TriggerType.FORM_SUBMIT, e, this)
        })
      }
    )
    this.runTriggerInEverywhere(trigger())
    };

  public domReadyTrigger(config: FTMConfiguration) {
    const _this = this
    $(function (e) {
      _this.domEventHandler(TriggerType.DOM_READY, this, e)
    });

  }


  public windowLoadTrigger(config: FTMConfiguration) {
    const _this = this

    $(window).on("load", function (e) {
      _this.domEventHandler(TriggerType.DOM_LOAD, this, e)
    })

  }

  private domEventHandler(triggered: TriggerType, _this: any, context: any) {
    this.prepareOutput(triggered, context, _this)

  }

  public historyChangeTrigger(config: FTMConfiguration) {
    const externalValueDecider = (e: FTMFilter, path: string | URL | null | undefined) => {
      switch (e.condition) {
        case FTMFilterCondition.NEW_PATH:
          return path
        case FTMFilterCondition.NEW_URL:
          return window.location.hostname + path
        case FTMFilterCondition.NEW_HOSTNAME:
          return window.location.hostname
        default:
          return undefined
      }
    }

    const solveFilter = (arg1: any, externalFilter: any) => {
      return this.solveFilter(arg1, externalFilter)
    }

    let _pushState = History.prototype.pushState;
    const _this = this;
    History.prototype.pushState = function (state, title, url) {
      //new url istenilen ile eşit mi diye kontrol sağlıyor.
      let results: Array<boolean> = []
      // I created results so we can use the other time to log why it's not working.
      config.filters.map((d: FTMFilter) => {
        // burada url dışında gerekli şeyler de gönderilecek birazdan gelince yapıcam :')
        const externalValue = externalValueDecider(d, url)
        results.push(solveFilter(d, externalValue))
      })
      if (results.indexOf(false) == -1) {
        _this.prepareOutput(TriggerType.HISTORY_CHANGE, undefined, undefined, {
          selector: this,
          state,
          title,
          url
        })
      }
      _pushState.call(this, state, title, url);

    };
  }

  public prepareTriggers(configs: Array<FTMConfiguration>) {
    /*    AND operation
        a=$('[myc="blue"][myid="1"][myid="3"]');
        OR operation, use commas
        a=$('[myc="blue"],[myid="1"],[myid="3"]');
        */
    configs.map((d: FTMConfiguration) => {
      switch (d.trigger.type) {
        case TriggerType.CLICK:
          this.clickTrigger(d)
          return true
        case TriggerType.HISTORY_CHANGE:
          this.historyChangeTrigger(d)
          break
        case TriggerType.DOM_READY:
          this.domReadyTrigger(d)
          break
        case TriggerType.DOM_LOAD:
          this.windowLoadTrigger(d)
          break
        case TriggerType.FORM_SUBMIT:

          this.formSubmitTrigger(d)
          break
      }
    })
    return true
  }


  public listen() {
  }
}

export default FormicaTagging;
