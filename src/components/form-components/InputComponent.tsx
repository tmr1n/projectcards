// InputComponent — публичный компонент для полей ввода в формах.
// Это тонкая обёртка над InputBase — вся логика стилей живёт там.
//
// ИЗМЕНЕНИЯ: убран React.forwardRef (React 19).
// В React 19 ref — обычный проп. Просто передаём его через пропсы дальше в InputBase.

import type React from 'react'
import { InputBase } from './InputBase'
import type { IInputComponentProps } from '@/shared/types/form.types'

// Добавляем ref как необязательный проп — компонент его принимает и передаёт в InputBase.
// react-hook-form передаёт ref для отслеживания DOM-элемента (фокус, сброс и т.д.)
type TInputComponentProps = IInputComponentProps & {
	ref?: React.Ref<HTMLInputElement>
}

export function InputComponent(props: TInputComponentProps) {
	// Всё передаём напрямую в InputBase — он рендерит нативный <input>
	return <InputBase {...props} />
}
