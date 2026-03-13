// FormLoader — оверлей-лоадер поверх формы во время отправки данных на сервер.
//
// КАК ИСПОЛЬЗОВАТЬ:
// 1. Оберни форму в <div className="relative"> (нужно для position: absolute у оверлея)
// 2. Добавь <FormLoader isLoading={isLoading} /> внутрь этого div
// 3. Управляй isLoading через useState в компоненте формы
//
// Пример:
//   const [isLoading, setIsLoading] = useState(false)
//   const onSubmit = async (data) => {
//     setIsLoading(true)
//     try { await sendToServer(data) }
//     finally { setIsLoading(false) }
//   }

// Тип пропсов компонента (I-префикс = интерфейс)
interface IFormLoaderProps {
	isLoading: boolean // true = показать лоадер и заблокировать форму
}

export function FormLoader({ isLoading }: IFormLoaderProps) {
	// Если не загружается — не рендерим ничего.
	// null в React = "не рендерить этот компонент"
	if (!isLoading) return null

	return (
		// Полупрозрачный оверлей:
		// absolute inset-0 = занимает всё пространство родителя (который должен быть relative)
		// z-10 = поверх содержимого формы
		// backdrop-blur = лёгкое размытие фона
		<div
			className='absolute inset-0 bg-white/75 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-lg'
			aria-busy='true'
			aria-label='Загрузка...'
		>
			{/* Спиннер: круг с разноцветными краями, вращается через animate-spin */}
			{/* border-blue-200 = светлая часть круга, border-t-blue-600 = тёмная (верхняя) */}
			<div className='w-10 h-10 border-[3px] border-blue-200 border-t-blue-600 rounded-full animate-spin' />
		</div>
	)
}
