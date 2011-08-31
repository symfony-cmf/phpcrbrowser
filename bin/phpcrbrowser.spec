%define __os_install_post %{nil}
%define __arch_install_post %{nil}

Name:           phpcrbrowser
Version:        %{git_tag}
Release:        0
Summary:        PHP CR Browser

Group:          PHPCR
License:        Open Source
BuildRoot:      %{_tmppath}/%{name}-%{version}-%{release}-root-%(%{__id_u} -n)
Requires:       php >= 5.3.4
BuildArch:      noarch

%description
PHP Content Repository Browser


%install
rm -rf $RPM_BUILD_ROOT
mkdir -p $RPM_BUILD_ROOT/var/www/phpcrbrowser
cp -r %{git_dir}/*   $RPM_BUILD_ROOT/var/www/phpcrbrowser/

%clean
rm -rf $RPM_BUILD_ROOT

%post

%files
%defattr(-,nginx,admins,-)
/var/www/phpcrbrowser
