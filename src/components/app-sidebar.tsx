import {
	BookOpen,
	GraduationCap,
	LayoutDashboard,
	Settings,
	User
} from 'lucide-react'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from '@/components/ui/sidebar'

const navMain = [
	{ title: 'Дашборд', url: '/dashboard', icon: LayoutDashboard },
	{ title: 'Мои колоды', url: '/decks', icon: BookOpen },
	{ title: 'Учиться', url: '/study', icon: GraduationCap }
]

const navSecondary = [
	{ title: 'Профиль', url: '/profile', icon: User },
	{ title: 'Настройки', url: '/settings', icon: Settings }
]

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarHeader className='px-4 py-4'>
				<span className='text-lg font-bold tracking-tight'>LangCards</span>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Главное</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navMain.map(item => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Аккаунт</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navSecondary.map(item => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className='px-4 py-3 text-xs text-muted-foreground'>
				LangCards © 2025
			</SidebarFooter>
		</Sidebar>
	)
}
