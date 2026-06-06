const DIGITS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
const UNITS = ['', '拾', '佰', '仟']
const BIG_UNITS = ['', '万', '亿', '万亿', '亿亿']

export type CurrencyUnit = 'yuan' | 'circle'

export interface NumberToChineseOptions {
  currencyUnit?: CurrencyUnit
}

export interface ConvertResult {
  success: boolean
  result: string
  message?: string
}

const CURRENCY_MAP: Record<CurrencyUnit, { yuan: string; jiao: string; fen: string; whole: string }> = {
  yuan: { yuan: '元', jiao: '角', fen: '分', whole: '整' },
  circle: { yuan: '圆', jiao: '角', fen: '分', whole: '整' }
}

export const numberToChinese = (
  input: string | number,
  options: NumberToChineseOptions = {}
): ConvertResult => {
  try {
    const { currencyUnit = 'yuan' } = options
    const currency = CURRENCY_MAP[currencyUnit]

    let numStr = typeof input === 'number' ? input.toString() : input

    if (numStr === undefined || numStr === null || numStr.trim() === '') {
      return { success: false, result: '', message: '请输入数字' }
    }

    numStr = numStr.toString().trim().replace(/,/g, '')

    if (!/^-?\d+(\.\d+)?$/.test(numStr)) {
      return { success: false, result: '', message: '输入格式不正确，请输入有效的数字' }
    }

    const isNegative = numStr.startsWith('-')
    if (isNegative) {
      numStr = numStr.slice(1)
    }

    const parts = numStr.split('.')
    const integerPart = parts[0]
    const decimalPart = parts[1] || ''

    if (integerPart.length > 16) {
      return { success: false, result: '', message: '整数部分最大支持16位（亿亿级）' }
    }

    let result = ''

    if (BigInt(integerPart) === 0n) {
      result = '零'
    } else {
      result = convertInteger(integerPart)
    }

    result += currency.yuan

    if (decimalPart) {
      result += convertDecimal(decimalPart, BigInt(integerPart) === 0n, currency)
    } else {
      result += currency.whole
    }

    if (isNegative) {
      result = '负' + result
    }

    return { success: true, result }
  } catch (error) {
    return { success: false, result: '', message: '转换失败：' + (error as Error).message }
  }
}

const convertInteger = (integerStr: string): string => {
  let result = ''
  let zeroFlag = false

  const groups: string[] = []
  const reversed = integerStr.split('').reverse().join('')
  for (let i = 0; i < reversed.length; i += 4) {
    groups.push(reversed.slice(i, i + 4).split('').reverse().join(''))
  }

  for (let g = groups.length - 1; g >= 0; g--) {
    const group = groups[g]
    const groupResult = convertGroup(group)
    const bigUnit = BIG_UNITS[g]

    if (groupResult !== '') {
      if (zeroFlag && result !== '') {
        result += '零'
      }
      result += groupResult + bigUnit
      zeroFlag = false
    } else if (result !== '' && !zeroFlag) {
      zeroFlag = true
    }
  }

  return result
}

const convertGroup = (group: string): string => {
  let result = ''
  let zeroFlag = false
  let hasNonZero = false

  for (let i = 0; i < group.length; i++) {
    const digit = parseInt(group[i])
    const unitIndex = group.length - 1 - i

    if (digit === 0) {
      if (hasNonZero) {
        zeroFlag = true
      }
    } else {
      if (zeroFlag) {
        result += '零'
        zeroFlag = false
      }
      result += DIGITS[digit] + UNITS[unitIndex]
      hasNonZero = true
    }
  }

  return result
}

interface CurrencyConfig {
  yuan: string
  jiao: string
  fen: string
  whole: string
}

const convertDecimal = (
  decimalStr: string,
  isZeroInteger: boolean,
  currency: CurrencyConfig
): string => {
  let result = ''
  let jiao = 0
  let fen = 0

  if (decimalStr.length >= 1) {
    jiao = parseInt(decimalStr[0])
  }
  if (decimalStr.length >= 2) {
    fen = parseInt(decimalStr[1])
  }

  if (jiao === 0 && fen === 0) {
    return currency.whole
  }

  if (jiao === 0) {
    if (!isZeroInteger) {
      result += '零'
    }
  } else {
    result += DIGITS[jiao] + currency.jiao
  }

  if (fen !== 0) {
    result += DIGITS[fen] + currency.fen
  }

  return result
}

export const formatNumberWithThousands = (num: number | string): string => {
  const str = typeof num === 'number' ? num.toString() : num
  const parts = str.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export const removeThousandsSeparator = (str: string): string => {
  return str.replace(/,/g, '')
}
