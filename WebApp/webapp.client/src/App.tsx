import { Button, Card, Text, TextInput } from '@gravity-ui/uikit';
import { useState } from 'react';
import { postToUrlAxios } from './api/apiclient';


function App() {
    const [inputIw, setInputIw] = useState<string | undefined>(undefined);
    const [inputIf, setInputIf] = useState<string | undefined>(undefined);
    const [inputVw, setInputVw] = useState<string | undefined>(undefined);
    const [inputFp, setInputFp] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [resultDepth, setResultDepth] = useState<string | undefined>(undefined);
    const [resultWidth, setResultWidth] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    const [invalidFields, setInvalidFields] = useState<string[]>([]);



    const updateInputValue = (field: string, value: string) => {
        switch (field) {
            case 'iw': setInputIw(value); break;
            case 'if': setInputIf(value); break;
            case 'vw': setInputVw(value); break;
            case 'fp': setInputFp(value); break;
        }
        clearInvalidField(field);
    }

    const clearInvalidField = (field: string) => {
        setInvalidFields(invalidFields.filter(f => f !== field));
    }

    const validateInput = () => {
        const invalidFields: string[] = [];
        if (!inputIw) invalidFields.push('iw');
        if (!inputIf) invalidFields.push('if');
        if (!inputVw) invalidFields.push('vw');
        if (!inputFp) invalidFields.push('fp');
        setInvalidFields(invalidFields);
        return invalidFields.length === 0;
    }

    const handleCalculate = async () => {
        setError(undefined);
        if (!validateInput()) return;
        setLoading(true);
        setResultDepth(undefined);
        setResultWidth(undefined);
        const request = {
            iw: parseFloat(inputIw!),
            if: parseFloat(inputIf!),
            vw: parseFloat(inputVw!),
            fp: parseFloat(inputFp!)
        }
        console.log(request);
        const res = await postToUrlAxios(request, '/api/calculate');
        if (res.success) {
            setResultDepth(res.resultObj.depth);
            setResultWidth(res.resultObj.width);
        }
        else {
            setError(res.message)
        }
        setLoading(false);
    }

    return (
        <div className='d-flex align-items-center flex-column g-3 p-3 overflow-auto'>
            <Text variant='subheader-3' className='text-center'>
                Веб-приложение для практического кейса
            </Text>
            <Text variant='header-1' style={{ maxWidth: "600px" }} className='text-center'>
                «Прогнозирование размеров сварного шва при электронно-лучевой сварке тонкостенных конструкций аэрокосмического назначения»
            </Text>
            <Card type='container' view='filled' className='p-3 d-flex flex-column g-3' style={{ maxWidth: "600px" }}>
                <Text variant='body-3' className='text-center'>
                    Введите параметры сварки и нажмите кнопку "Рассчитать" для получения прогноза размеров сварного шва.
                </Text>
                <div>
                    <Text variant='body-2'>
                        Величина сварочного тока (IW)
                    </Text>
                    <TextInput
                        type='number'
                        value={inputIw}
                        validationState={invalidFields.includes('iw') ? 'invalid' : undefined}
                        onChange={(e) => updateInputValue('iw', e.target.value)}></TextInput>
                </div>
                <div>
                    <Text variant='body-2'>
                        Ток фокусировки электронного пучка (IF)
                    </Text>
                    <TextInput
                        type='number'
                        value={inputIf}
                        validationState={invalidFields.includes('if') ? 'invalid' : undefined}
                        onChange={(e) => updateInputValue('if', e.target.value)}></TextInput>
                </div>
                <div>
                    <Text variant='body-2'>
                        Скорость сварки (VW)
                    </Text>
                    <TextInput
                        type='number'
                        value={inputVw}
                        validationState={invalidFields.includes('vw') ? 'invalid' : undefined}
                        onChange={(e) => updateInputValue('vw', e.target.value)}></TextInput>
                </div>
                <div>
                    <Text variant='body-2'>
                        Расстояние от поверхности свариваемого металла до электронно-оптической системы (FP)
                    </Text>
                    <TextInput
                        type='number'
                        value={inputFp}
                        validationState={invalidFields.includes('fp') ? 'invalid' : undefined}
                        onChange={(e) => updateInputValue('fp', e.target.value)}></TextInput>
                </div>
                <Button view='action' loading={loading} onClick={handleCalculate} >
                    Рассчитать
                </Button>
            </Card>
            {!error && resultDepth && resultWidth &&
                <Card
                    type='container'
                    view='filled'
                    className='p-3 d-flex flex-column g-3'
                    style={{ maxWidth: "600px" }}>
                    <Text variant='body-2'>
                        Прогнозируемая глубина сварного шва: {resultDepth}
                    </Text>
                    <Text variant='body-2'>
                        Прогнозируемая ширина сварного шва: {resultWidth}
                    </Text>
                </Card>
            }
            {
                error && (
                    <Card type='container' theme='danger' view='filled' className='p-3 d-flex flex-column g-3' style={{ maxWidth: "600px" }}>
                        <Text variant='subheader-2' className='text-center'>
                            Ошибка
                        </Text>
                        <Text variant='body-3' className='text-center'>
                            {error}
                        </Text>
                    </Card>
                )
            }
        </div>
    );

}

export default App;