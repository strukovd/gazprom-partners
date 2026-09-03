<template>
	<section id="readings-page">
		<main class="page-blocks">
			<section class="rp-stats">
				<BaseIsland class="rp-stat">
					<div class="rp-stat-icon violet">
						<BaseIcon name="mdi-layers-triple-outline" size="1.35em"/>
					</div>
					<div class="rp-stat-info">
						<div class="rp-stat-value">3</div>
						<div class="rp-stat-title">Участков</div>
					</div>
				</BaseIsland>

				<BaseIsland class="rp-stat">
					<div class="rp-stat-icon blue">
						<BaseIcon name="mdi-transit-connection-variant" size="1.35em"/>
					</div>
					<div class="rp-stat-info">
						<div class="rp-stat-value">5</div>
						<div class="rp-stat-title">Маршрутов</div>
					</div>
				</BaseIsland>

				<BaseIsland class="rp-stat">
					<div class="rp-stat-icon green">
						<BaseIcon name="mdi-check-circle-outline" size="1.35em"/>
					</div>
					<div class="rp-stat-info">
						<div class="rp-stat-value">29</div>
						<div class="rp-stat-title">Собрано</div>
					</div>
				</BaseIsland>

				<BaseIsland class="rp-stat">
					<div class="rp-stat-icon orange">
						<BaseIcon name="mdi-clock-outline" size="1.35em"/>
					</div>
					<div class="rp-stat-info">
						<div class="rp-stat-value">38</div>
						<div class="rp-stat-title">Не собрано</div>
					</div>
				</BaseIsland>
			</section>

			<section class="rp-section-title">
				<span class="rp-section-text">Участки</span>
				<span class="rp-section-date">25.05.2026</span>
			</section>

			<section class="rp-districts">
				<BaseIsland class="rp-district active">
					<header class="rp-district-header">
						<div class="rp-district-title">
							<div class="rp-title-line">
								<BaseIcon name="mdi-layers-outline" size="1.1em"/>
								<span class="rp-title-text">Участок №1</span>
							</div>
							<div class="rp-area-line">
								<BaseIcon name="mdi-city-variant-outline" size="1em"/>
								<span class="rp-area-text">Свердловский р-н</span>
							</div>
						</div>
						<div class="rp-badge work">В работе</div>
					</header>

					<div class="rp-workers">
						<div class="rp-worker">
							<Avatar name="Некрасова Наталия Михайловна" size="2em"/>
							<span class="rp-worker-name">Некрасова Наталия Михайловна</span>
						</div>
						<div class="rp-worker">
							<Avatar name="Асанов Тимур Бакытбекович" size="2em"/>
							<span class="rp-worker-name">Асанов Тимур Бакытбекович</span>
						</div>
					</div>

					<div class="rp-progress">
						<div class="rp-progress-header">
							<span class="rp-progress-title">Общий прогресс</span>
							<span class="rp-progress-count">10/33</span>
						</div>
						<div class="rp-progress-line">
							<div class="rp-progress-fill" style="width:30%;"></div>
						</div>
						<div class="rp-progress-percent">30%</div>
					</div>

					<div class="rp-routes">
						<span class="rp-route active">1100802</span>
						<span class="rp-route">1100803</span>
					</div>

					<div class="rp-totals">
						<div class="rp-total routes">
							<div class="rp-total-value">2</div>
							<div class="rp-total-title">Маршрутов</div>
						</div>
						<div class="rp-total collected">
							<div class="rp-total-value">10</div>
							<div class="rp-total-title">Собрано</div>
						</div>
						<div class="rp-total missing">
							<div class="rp-total-value">23</div>
							<div class="rp-total-title">Не собрано</div>
						</div>
					</div>

					<BaseButton class="rp-route-button" prependIcon="mdi-transit-connection-variant">Маршруты участка</BaseButton>
				</BaseIsland>

				<BaseIsland class="rp-district active">
					<header class="rp-district-header">
						<div class="rp-district-title">
							<div class="rp-title-line">
								<BaseIcon name="mdi-layers-outline" size="1.1em"/>
								<span class="rp-title-text">Участок №2</span>
							</div>
							<div class="rp-area-line">
								<BaseIcon name="mdi-city-variant-outline" size="1em"/>
								<span class="rp-area-text">Октябрьский р-н</span>
							</div>
						</div>
						<div class="rp-badge work">В работе</div>
					</header>

					<div class="rp-workers">
						<div class="rp-worker">
							<Avatar name="Джумабеков Азат Сейитович" size="2em"/>
							<span class="rp-worker-name">Джумабеков Азат Сейитович</span>
						</div>
						<div class="rp-worker">
							<Avatar name="Рысбекова Гульмира Абдукаримовна" size="2em"/>
							<span class="rp-worker-name">Рысбекова Гульмира Абдукаримовна</span>
						</div>
					</div>

					<div class="rp-progress">
						<div class="rp-progress-header">
							<span class="rp-progress-title">Общий прогресс</span>
							<span class="rp-progress-count">19/24</span>
						</div>
						<div class="rp-progress-line">
							<div class="rp-progress-fill" style="width:79%;"></div>
						</div>
						<div class="rp-progress-percent">79%</div>
					</div>

					<div class="rp-routes">
						<span class="rp-route success">1100804</span>
						<span class="rp-route active">1100805</span>
					</div>

					<div class="rp-totals">
						<div class="rp-total routes">
							<div class="rp-total-value">2</div>
							<div class="rp-total-title">Маршрутов</div>
						</div>
						<div class="rp-total collected">
							<div class="rp-total-value">19</div>
							<div class="rp-total-title">Собрано</div>
						</div>
						<div class="rp-total missing">
							<div class="rp-total-value">5</div>
							<div class="rp-total-title">Не собрано</div>
						</div>
					</div>

					<BaseButton class="rp-route-button" prependIcon="mdi-transit-connection-variant">Маршруты участка</BaseButton>
				</BaseIsland>

				<BaseIsland class="rp-district">
					<header class="rp-district-header">
						<div class="rp-district-title">
							<div class="rp-title-line">
								<BaseIcon name="mdi-layers-outline" size="1.1em"/>
								<span class="rp-title-text">Участок №3</span>
							</div>
							<div class="rp-area-line">
								<BaseIcon name="mdi-city-variant-outline" size="1em"/>
								<span class="rp-area-text">Первомайский р-н</span>
							</div>
						</div>
						<div class="rp-badge new">Новый</div>
					</header>

					<div class="rp-workers">
						<div class="rp-worker">
							<Avatar name="Токтоматтов Санжар Элибекович" size="2em"/>
							<span class="rp-worker-name">Токтоматтов Санжар Элибекович</span>
						</div>
					</div>

					<div class="rp-progress">
						<div class="rp-progress-header">
							<span class="rp-progress-title">Общий прогресс</span>
							<span class="rp-progress-count">0/10</span>
						</div>
						<div class="rp-progress-line">
							<div class="rp-progress-fill" style="width:0%;"></div>
						</div>
						<div class="rp-progress-percent">0%</div>
					</div>

					<div class="rp-routes">
						<span class="rp-route">1100806</span>
					</div>

					<div class="rp-totals">
						<div class="rp-total routes">
							<div class="rp-total-value">1</div>
							<div class="rp-total-title">Маршрутов</div>
						</div>
						<div class="rp-total collected">
							<div class="rp-total-value">0</div>
							<div class="rp-total-title">Собрано</div>
						</div>
						<div class="rp-total missing">
							<div class="rp-total-value">10</div>
							<div class="rp-total-title">Не собрано</div>
						</div>
					</div>

					<BaseButton class="rp-route-button" prependIcon="mdi-transit-connection-variant">Маршруты участка</BaseButton>
				</BaseIsland>
			</section>
		</main>
	</section>
</template>

<script lang="ts" setup>
import Avatar from '~/components/common/Avatar.vue';
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
</script>

<style lang="scss">
#readings-page {
	.page-blocks {
		display: grid;
		gap: 1.4em;
		margin: 1em 0;
	}

	.rp-stats {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1em;

		.rp-stat {
			display: flex;
			align-items: center;
			gap: 1em;
			min-height: 5em;
			padding: 1.25em 1.35em;
			overflow: hidden;
			border-color: #dbe3ee;
			box-shadow: 0 5px 14px rgba(15, 23, 42, .08);

			.rp-stat-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 3em;
				height: 3em;
				border-radius: 50%;

				&.violet {
					color: #a21caf;
					background: #fae8ff;
				}

				&.blue {
					color: #2563eb;
					background: #dbeafe;
				}

				&.green {
					color: #16a34a;
					background: #dcfce7;
				}

				&.orange {
					color: #f97316;
					background: #ffedd5;
				}
			}

			.rp-stat-info {
				.rp-stat-value {
					color: #020617;
					font-size: 1.55rem;
					font-weight: 900;
					line-height: 1;
				}

				.rp-stat-title {
					margin-top: .45em;
					color: #475569;
					font-size: .82rem;
					font-weight: 600;
				}
			}
		}
	}

	.rp-section-title {
		display: flex;
		align-items: center;
		gap: .45em;
		color: #94a3b8;
		font-size: .88rem;
		font-weight: 900;
		letter-spacing: .04em;
		text-transform: uppercase;

		.rp-section-date {
			color: #64748b;
		}
	}

	.rp-districts {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1em;

		.rp-district {
			display: grid;
			gap: 1.15em;
			padding: 1.25em;
			overflow: hidden;
			border-color: #dbe3ee;
			border-top: 6px solid #cbd5e1;
			box-shadow: 0 6px 18px rgba(15, 23, 42, .08);

			&.active {
				border-top-color: #2563eb;
			}

			.rp-district-header {
				display: flex;
				justify-content: space-between;
				gap: 1em;

				.rp-district-title {
					min-width: 0;

					.rp-title-line {
						display: flex;
						align-items: center;
						gap: .35em;
						color: #2563eb;

						.rp-title-text {
							color: #020617;
							font-size: 1.2rem;
							font-weight: 900;
						}
					}

					.rp-area-line {
						display: flex;
						align-items: center;
						gap: .35em;
						margin-top: .45em;
						color: #94a3b8;
						font-size: .82rem;
						font-weight: 700;
					}
				}

				.rp-badge {
					align-self: flex-start;
					padding: .45em .75em;
					border-radius: 999px;
					font-size: .78rem;
					font-weight: 800;
					white-space: nowrap;

					&.work {
						color: #2563eb;
						background: #dbeafe;
					}

					&.new {
						color: #64748b;
						background: #f1f5f9;
					}
				}
			}

			.rp-workers {
				display: grid;
				gap: .55em;
				min-height: 5.4em;
				padding: .9em;
				background: #f8fafc;
				border-radius: 14px;

				.rp-worker {
					display: flex;
					align-items: center;
					gap: .65em;
					min-width: 0;

					.rp-worker-name {
						overflow: hidden;
						color: #0f172a;
						font-size: .9rem;
						font-weight: 700;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			}

			.rp-progress {
				.rp-progress-header {
					display: flex;
					justify-content: space-between;
					gap: 1em;
					color: #475569;
					font-size: .82rem;
					font-weight: 700;

					.rp-progress-count {
						color: #020617;
						font-weight: 900;
					}
				}

				.rp-progress-line {
					height: .5em;
					margin-top: .65em;
					overflow: hidden;
					background: #f1f5f9;
					border-radius: 999px;

					.rp-progress-fill {
						height: 100%;
						background: #2563eb;
						border-radius: inherit;
					}
				}

				.rp-progress-percent {
					margin-top: .35em;
					color: #94a3b8;
					font-size: .78rem;
					font-weight: 700;
					text-align: right;
				}
			}

			.rp-routes {
				display: flex;
				flex-wrap: wrap;
				gap: .45em;

				.rp-route {
					padding: .45em .75em;
					color: #64748b;
					background: #f1f5f9;
					border-radius: 10px;
					font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
					font-size: .82rem;
					font-weight: 900;

					&.active {
						color: #2563eb;
						background: #dbeafe;
					}

					&.success {
						color: #16a34a;
						background: #dcfce7;
					}
				}
			}

			.rp-totals {
				display: grid;
				grid-template-columns: repeat(3, minmax(0, 1fr));
				gap: .7em;

				.rp-total {
					padding: .8em .6em;
					border-radius: 14px;
					text-align: center;

					.rp-total-value {
						color: #020617;
						font-size: 1.05rem;
						font-weight: 900;
					}

					.rp-total-title {
						margin-top: .35em;
						font-size: .72rem;
						font-weight: 700;
					}

					&.routes {
						background: #f8fafc;

						.rp-total-title {
							color: #64748b;
						}
					}

					&.collected {
						background: #ecfdf5;

						.rp-total-value,
						.rp-total-title {
							color: #16a34a;
						}
					}

					&.missing {
						background: #fff7ed;

						.rp-total-value,
						.rp-total-title {
							color: #ea580c;
						}
					}
				}
			}

			.rp-route-button {
				justify-content: center;
				width: 100%;
				min-height: 3.1em;
				font-size: 1rem;
				border-radius: 12px;
			}
		}
	}
}
</style>
