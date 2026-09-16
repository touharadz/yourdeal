const cards = [...document.querySelectorAll('.deal-card')];
const grid = document.querySelector('#deal-grid');
const searchInputs = [document.querySelector('#deal-search'), document.querySelector('#hero-search')].filter(Boolean);
const categories = [...document.querySelectorAll('.category')];
const sortSelect = document.querySelector('#deal-sort');
const resultCount = document.querySelector('#result-count');
const modalBackdrop = document.querySelector('#modal-backdrop');

function updateDeals() {
  const query = (searchInputs[0]?.value || '').trim().toLowerCase();
  const activeCategory = document.querySelector('.category.active')?.dataset.category || 'all';
  const visibleCards = cards.filter((card) => {
    const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
    const matchesQuery = !query || `${card.dataset.title} ${card.textContent}`.toLowerCase().includes(query);
    card.hidden = !(matchesCategory && matchesQuery);
    return !card.hidden;
  });
  resultCount.textContent = `${visibleCards.length} عروض`;
}

function sortDeals() {
  const cardsInOrder = [...cards].sort((first, second) => {
    if (sortSelect.value === 'discount') return Number(second.dataset.discount) - Number(first.dataset.discount);
    if (sortSelect.value === 'new') return Number(first.dataset.age) - Number(second.dataset.age);
    return Number(second.dataset.votes) - Number(first.dataset.votes);
  });
  cardsInOrder.forEach((card) => grid.append(card));
  updateDeals();
}

categories.forEach((category) => category.addEventListener('click', () => {
  categories.forEach((item) => item.classList.remove('active'));
  category.classList.add('active');
  updateDeals();
}));

searchInputs.forEach((input) => input.addEventListener('input', () => {
  searchInputs.forEach((otherInput) => { if (otherInput !== input) otherInput.value = input.value; });
  updateDeals();
}));
sortSelect.addEventListener('change', sortDeals);

document.querySelector('#hero-search-button').addEventListener('click', () => {
  document.querySelector('#deals').scrollIntoView({ behavior: 'smooth' });
  document.querySelector('#deal-search').focus();
});

document.querySelectorAll('.vote-button').forEach((button) => button.addEventListener('click', () => {
  const value = button.querySelector('strong');
  const voted = button.classList.toggle('voted');
  value.textContent = Number(value.textContent) + (voted ? 1 : -1);
}));

document.querySelectorAll('.save-button').forEach((button) => button.addEventListener('click', () => {
  button.classList.toggle('saved');
  button.textContent = button.classList.contains('saved') ? '♥' : '♡';
}));

document.querySelectorAll('.view-button').forEach((button, index, buttons) => button.addEventListener('click', () => {
  buttons.forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  grid.classList.toggle('list-view', index === 1);
}));

document.querySelector('#theme-toggle').addEventListener('click', () => document.body.classList.toggle('dark-mode'));
document.querySelector('#load-more').addEventListener('click', (event) => {
  event.currentTarget.textContent = 'تم عرض جميع العروض المتاحة';
  event.currentTarget.disabled = true;
});

function closeModal() {
  modalBackdrop.hidden = true;
  document.querySelector('.form-message').textContent = '';
}

document.querySelectorAll('[data-open-modal]').forEach((button) => button.addEventListener('click', () => {
  modalBackdrop.hidden = false;
  document.querySelector('#modal-title').textContent = button.dataset.openModal === 'login' ? 'أهلاً بك في YourDeal' : 'انشر عرضاً جديداً';
  document.querySelector('#publish-form').classList.toggle('hidden', button.dataset.openModal === 'login');
}));
document.querySelector('.modal-close').addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (event) => { if (event.target === modalBackdrop) closeModal(); });
document.querySelector('#publish-form').addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('.form-message').textContent = 'تم استلام العرض، شكراً لمشاركتك.';
  event.currentTarget.reset();
});
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modalBackdrop.hidden) closeModal(); });
updateDeals();
